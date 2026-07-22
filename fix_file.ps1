$filePath = "d:\Huzzler-main\Huzzler-main\src\Firebasejobs\Clientserachbarr.jsx"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Find the end of filteredJobs memo
$targetStart = "}, [jobs, searchText, blockedUsers]);"
$startIndex = $content.IndexOf($targetStart)
if ($startIndex -lt 0) {
    Write-Error "Could not find targetStart"
    exit 1
}
$startIndex += $targetStart.Length

# Find the start of the clean new UI comment
$targetEnd = "{/* NEW DASHBOARD UI INJECTED BELOW */}"
$endIndex = $content.LastIndexOf($targetEnd)
if ($endIndex -lt 0) {
    Write-Error "Could not find targetEnd"
    exit 1
}

$before = $content.Substring(0, $startIndex)
$after = $content.Substring($endIndex)

# Build the replacement for the middle section using single-quoted here-string to avoid expansion of $job
$replacement = @'


  // ─── Open job ─────────────────────────────────────────────────────────────
  async function openJob(job) {
    if (blockedUsers.has(String(job.ownerId))) {
      alert("This user is blocked");
      return;
    }
    if (!job?._id) return;
    const collectionName =
      job._source === "service_24h" ? "service_24h" : "services";
    try {
      await setDoc(
        doc(db, collectionName, job._id),
        { views: increment(1) },
        { merge: true }
      );
    } catch (err) {
      console.error("Error updating views:", err);
    }
    if (job._source === "service_24h")
      navigate(`/client-dashbroad2/service-24h/${job._id}`);
    else navigate(`/client-dashbroad2/service/${job._id}`);
  }

  function toggleSaveJob(id) {
    setSavedJobs((prev) => {
      const ns = new Set(prev);
      if (ns.has(id)) ns.delete(id);
      else ns.add(id);
      return ns;
    });
  }

  // ======================================================
  // UI
  // ======================================================
  return (
    <>
      
'@

$newContent = $before + $replacement + $after

# Also fix the wave emoji corruptions (dY`<) if any remain
$newContent = $newContent.Replace("dY`<", "👋")

[System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated file"
