import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase";

class WebAnalyticsService {
  constructor() {
    this.sessionStartTime = null;
    this.interactionCount = 0;
    this.sessionTimer = null;
    this.heartbeatTimer = null;
    this.lastHeartbeatSent = null;
    this.isInitialized = false;
    this.platform = "web";
  }

 
  async init(userId) {
    if (this.isInitialized) {
      console.log("📊 Analytics already initialized");
      return;
    }

    try {
      this.userId = userId;
      this.isInitialized = true;

      // Start session tracking
      this._startSession();

      // Start heartbeat
      this._startHeartbeat();

      // Track app startup (uptime event)
      await this.trackAppUptime();

      // Track user activity
      await this.trackDailyActiveUser(userId);
      await this.trackMonthlyActiveUser(userId);
      await this.updateUserLastActive(userId);

      // Set up visibility change listener
      this._setupVisibilityListener();

      // Set up error handlers
      this._setupErrorHandlers();

      console.log("✅ Web Analytics initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing analytics:", error);
      await this.trackAppError(error.toString());
    }
  }

  /**
   * Clean up analytics when user logs out
   */
  async cleanup() {
    await this._endSession();
    this._stopHeartbeat();
    this.isInitialized = false;
    console.log("🛑 Analytics cleanup complete");
  }


  async updateUserLastActive(uid) {
    try {
      await setDoc(
        doc(db, "users", uid),
        {
          lastActiveAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("❌ Error updating last active:", error);
    }
  }

  /**
   * Track Daily Active User (DAU)
   */
  async trackDailyActiveUser(uid) {
    try {
      const today = new Date();
      const dateId = this._formatDate(today);

      const docRef = doc(
        db,
        "daily_active_users",
        dateId,
        "users",
        uid
      );

      await setDoc(
        docRef,
        {
          lastActiveAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log(`📅 DAU tracked: ${dateId}`);
    } catch (error) {
      console.error("❌ Error tracking DAU:", error);
    }
  }

  /**
   * Track Monthly Active User (MAU)
   */
  async trackMonthlyActiveUser(uid) {
    try {
      const now = new Date();
      const monthId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const docRef = doc(
        db,
        "monthly_active_users",
        monthId,
        "users",
        uid
      );

      await setDoc(
        docRef,
        {
          lastActiveAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log(`📆 MAU tracked: ${monthId}`);
    } catch (error) {
      console.error("❌ Error tracking MAU:", error);
    }
  }

  // =========================================================================
  // SESSION TRACKING
  // =========================================================================

  /**
   * Start a new session
   */
  _startSession() {
    this.sessionStartTime = new Date();
    this.interactionCount = 0;

    // Track engagement every 30 seconds
    this.sessionTimer = setInterval(() => {
      this._trackSessionEngagement();
    }, 30000); // 30 seconds

    console.log("🚀 Session started");
  }

  /**
   * End current session and save metrics
   */
  async _endSession() {
    if (!this.sessionStartTime) return;

    try {
      const sessionDuration = new Date() - this.sessionStartTime;
      const durationMinutes = sessionDuration / 60000;

      // Track final session duration
      await this._trackSessionDuration(durationMinutes);

      // Track final engagement
      await this._trackSessionEngagement();

      // Update average session duration
      await this._updateAvgSessionDuration(durationMinutes);

      // Update session engagement
      await this._updateSessionEngagement(
        this._calculateEngagementScore(sessionDuration)
      );

      console.log(`✅ Session ended: ${durationMinutes.toFixed(1)} minutes`);

      // Reset
      this.sessionStartTime = null;
      this.interactionCount = 0;
      clearInterval(this.sessionTimer);
    } catch (error) {
      console.error("❌ Error ending session:", error);
    }
  }

  /**
   * Track session engagement metrics
   */
  async _trackSessionEngagement() {
    if (!this.sessionStartTime) return;

    try {
      const now = new Date();
      const sessionDuration = now - this.sessionStartTime;
      const engagementScore = this._calculateEngagementScore(sessionDuration);

      await addDoc(collection(db, "session_engagement_logs"), {
        platform: this.platform,
        sessionDurationMinutes: sessionDuration / 60000,
        interactionCount: this.interactionCount,
        engagementScore: engagementScore,
        timestamp: serverTimestamp(),
      });

      console.log(`📊 Session engagement tracked: ${engagementScore}%`);
    } catch (error) {
      console.error("❌ Error tracking session engagement:", error);
    }
  }

  /**
   * Calculate engagement score (0-100)
   */
  _calculateEngagementScore(sessionDuration) {
    const durationMinutes = sessionDuration / 60000;
    
    // Duration score (max 50 points for 30+ min)
    const durationScore = Math.min((durationMinutes / 30) * 50, 50);
    
    // Interaction score (max 50 points for 100+ interactions)
    const interactionScore = Math.min((this.interactionCount / 100) * 50, 50);
    
    return parseFloat((durationScore + interactionScore).toFixed(1));
  }

  /**
   * Track user interactions (call this on clicks, scrolls, etc.)
   */
  trackInteraction() {
    this.interactionCount++;
  }

  /**
   * Track session duration
   */
  async _trackSessionDuration(durationMinutes) {
    try {
      const now = new Date();
      const dateId = this._formatDate(now);

      await addDoc(
        collection(db, "session_metrics", dateId, "sessions"),
        {
          platform: this.platform,
          durationMinutes: durationMinutes,
          timestamp: serverTimestamp(),
        }
      );

      // Increment total sessions
      await this._incrementTotalSessions();
    } catch (error) {
      console.error("❌ Error tracking session duration:", error);
    }
  }

  /**
   * Increment total sessions counter
   */
  async _incrementTotalSessions() {
    try {
      const metricsRef = doc(db, "app_metrics", this.platform);
      const docSnap = await getDoc(metricsRef);

      if (!docSnap.exists()) {
        await setDoc(metricsRef, {
          totalSessions: 1,
          lastUpdated: serverTimestamp(),
        });
      } else {
        await updateDoc(metricsRef, {
          totalSessions: increment(1),
          lastUpdated: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("❌ Error incrementing total sessions:", error);
    }
  }

  /**
   * Update average session duration
   */
  async _updateAvgSessionDuration(durationMinutes) {
    try {
      const metricsRef = doc(db, "app_metrics", this.platform);
      const docSnap = await getDoc(metricsRef);

      if (!docSnap.exists()) {
        await setDoc(
          metricsRef,
          {
            avgSessionDuration: durationMinutes,
            totalSessionMinutes: durationMinutes,
            sessionCount: 1,
            lastUpdated: serverTimestamp(),
          },
          { merge: true }
        );
        return;
      }

      const data = docSnap.data();
      const totalSessionMinutes =
        (data.totalSessionMinutes || 0) + durationMinutes;
      const sessionCount = (data.sessionCount || 0) + 1;
      const avgSessionDuration = totalSessionMinutes / sessionCount;

      await updateDoc(metricsRef, {
        avgSessionDuration: parseFloat(avgSessionDuration.toFixed(1)),
        totalSessionMinutes: totalSessionMinutes,
        sessionCount: sessionCount,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("❌ Error updating avg session duration:", error);
    }
  }

  /**
   * Update session engagement
   */
  async _updateSessionEngagement(engagementScore) {
    try {
      const metricsRef = doc(db, "app_metrics", this.platform);
      const docSnap = await getDoc(metricsRef);

      if (!docSnap.exists()) {
        await setDoc(
          metricsRef,
          {
            sessionEngagement: engagementScore,
            totalEngagementScore: engagementScore,
            engagementCount: 1,
            lastUpdated: serverTimestamp(),
          },
          { merge: true }
        );
        return;
      }

      const data = docSnap.data();
      const totalEngagementScore =
        (data.totalEngagementScore || 0) + engagementScore;
      const engagementCount = (data.engagementCount || 0) + 1;
      const avgEngagement = totalEngagementScore / engagementCount;

      await updateDoc(metricsRef, {
        sessionEngagement: parseFloat(avgEngagement.toFixed(1)),
        totalEngagementScore: totalEngagementScore,
        engagementCount: engagementCount,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("❌ Error updating session engagement:", error);
    }
  }

  // =========================================================================
  // UPTIME / DOWNTIME TRACKING
  // =========================================================================

  /**
   * Track successful app startup (uptime event)
   */
  async trackAppUptime() {
    try {
      const now = new Date();
      const dateId = this._formatDate(now);

      await addDoc(collection(db, "uptime_logs", dateId, "events"), {
        platform: this.platform,
        type: "startup",
        timestamp: serverTimestamp(),
        success: true,
      });

      await this._updateUptimeMetrics(true);

      console.log("✅ Uptime tracked successfully");
    } catch (error) {
      console.error("❌ Error tracking uptime:", error);
    }
  }

  /**
   * Track app errors or failures (downtime event)
   */
  async trackAppError(errorMessage) {
    try {
      const now = new Date();
      const dateId = this._formatDate(now);

      await addDoc(collection(db, "uptime_logs", dateId, "events"), {
        platform: this.platform,
        type: "error",
        timestamp: serverTimestamp(),
        success: false,
        error: errorMessage,
      });

      await this._updateUptimeMetrics(false);

      console.log(`⚠️ Error tracked: ${errorMessage}`);
    } catch (error) {
      console.error("❌ Error tracking app error:", error);
    }
  }

  /**
   * Log a downtime incident
   */
  async logDowntimeIncident(reason, durationMinutes) {
    try {
      await addDoc(collection(db, "downtime_logs"), {
        platform: this.platform,
        reason: reason,
        durationMin: durationMinutes,
        startedAt: serverTimestamp(),
      });

      console.log(`📝 Downtime incident logged: ${reason}`);
    } catch (error) {
      console.error("❌ Error logging downtime:", error);
    }
  }

  /**
   * Update uptime/downtime percentages
   */
  async _updateUptimeMetrics(isSuccess) {
    try {
      const metricsRef = doc(db, "app_metrics", this.platform);
      const docSnap = await getDoc(metricsRef);

      if (!docSnap.exists()) {
        await setDoc(metricsRef, {
          uptimePercent: isSuccess ? 100.0 : 99.9,
          downtimePercent: isSuccess ? 0.0 : 0.1,
          totalEvents: 1,
          successfulEvents: isSuccess ? 1 : 0,
          failedEvents: isSuccess ? 0 : 1,
          crashFrequency: 0.0,
          avgSessionDuration: 0.0,
          sessionEngagement: 0.0,
          lastUpdated: serverTimestamp(),
        });
        return;
      }

      const data = docSnap.data();
      const totalEvents = (data.totalEvents || 0) + 1;
      const successfulEvents =
        (data.successfulEvents || 0) + (isSuccess ? 1 : 0);
      const failedEvents = (data.failedEvents || 0) + (isSuccess ? 0 : 1);

      const uptimePercent = (successfulEvents / totalEvents) * 100;
      const downtimePercent = (failedEvents / totalEvents) * 100;

      await updateDoc(metricsRef, {
        uptimePercent: parseFloat(uptimePercent.toFixed(2)),
        downtimePercent: parseFloat(downtimePercent.toFixed(2)),
        totalEvents: totalEvents,
        successfulEvents: successfulEvents,
        failedEvents: failedEvents,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("❌ Error updating uptime metrics:", error);
    }
  }

  // =========================================================================
  // CRASH TRACKING
  // =========================================================================

  /**
   * Track app crashes
   */
  async trackCrash(error, stackTrace) {
    try {
      const now = new Date();
      const dateId = this._formatDate(now);

      await addDoc(collection(db, "crash_logs", dateId, "crashes"), {
        platform: this.platform,
        error: error.toString(),
        stackTrace: stackTrace || error.stack || "N/A",
        timestamp: serverTimestamp(),
      });

      await this._updateCrashFrequency();

      console.log(`💥 Crash tracked: ${error}`);
    } catch (err) {
      console.error("❌ Error tracking crash:", err);
    }
  }

  /**
   * Update crash frequency
   */
  async _updateCrashFrequency() {
    try {
      const metricsRef = doc(db, "app_metrics", this.platform);
      const docSnap = await getDoc(metricsRef);

      if (!docSnap.exists()) {
        await setDoc(
          metricsRef,
          {
            crashFrequency: 1.0,
            totalCrashes: 1,
            totalSessions: 1,
            lastUpdated: serverTimestamp(),
          },
          { merge: true }
        );
        return;
      }

      const data = docSnap.data();
      const totalCrashes = (data.totalCrashes || 0) + 1;
      const totalSessions = data.totalSessions || 1;

      const crashFrequency = (totalCrashes / totalSessions) * 100;

      await updateDoc(metricsRef, {
        crashFrequency: parseFloat(crashFrequency.toFixed(2)),
        totalCrashes: totalCrashes,
        lastUpdated: serverTimestamp(),
      });

      console.log(`📊 Crash frequency updated: ${crashFrequency.toFixed(2)}%`);
    } catch (error) {
      console.error("❌ Error updating crash frequency:", error);
    }
  }

  /**
   * Set up global error handlers
   */
  _setupErrorHandlers() {
    // Handle unhandled errors
    window.addEventListener("error", (event) => {
      this.trackCrash(event.error || event.message, event.error?.stack);
    });

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.trackCrash(
        event.reason || "Unhandled Promise Rejection",
        event.reason?.stack
      );
    });
  }

  // =========================================================================
  // HEARTBEAT TRACKING
  // =========================================================================

  /**
   * Start sending heartbeat signals
   */
  _startHeartbeat() {
    this._sendHeartbeat();

    // Send heartbeat every 5 minutes
    this.heartbeatTimer = setInterval(() => {
      this._sendHeartbeat();
    }, 300000); // 5 minutes
  }

  /**
   * Stop sending heartbeat signals
   */
  _stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Send app heartbeat signal
   */
  async _sendHeartbeat() {
    const now = new Date();

    // Prevent spam (1 heartbeat per 5 min)
    if (
      this.lastHeartbeatSent &&
      now - this.lastHeartbeatSent < 300000
    ) {
      return;
    }

    this.lastHeartbeatSent = now;

    try {
      await setDoc(
        doc(db, "app_heartbeat", this.platform),
        {
          platform: this.platform,
          lastSeen: serverTimestamp(),
          status: "online",
        },
        { merge: true }
      );

      console.log("❤️ Heartbeat sent");
    } catch (error) {
      console.error("❌ Error sending heartbeat:", error);
    }
  }

  // =========================================================================
  // VISIBILITY HANDLING
  // =========================================================================

  /**
   * Handle page visibility changes
   */
  _setupVisibilityListener() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Page is hidden (user switched tabs or minimized)
        console.log("⏸️ Page hidden - pausing session");
        this._endSession();
      } else {
        // Page is visible again
        console.log("▶️ Page visible - resuming session");
        this._startSession();
        this._sendHeartbeat();

        if (this.userId) {
          this.updateUserLastActive(this.userId);
        }
      }
    });

    // Handle beforeunload (page close/refresh)
    window.addEventListener("beforeunload", () => {
      this._endSession();
    });
  }

  // =========================================================================
  // UTILITY FUNCTIONS
  // =========================================================================

  /**
   * Format date as YYYY-MM-DD
   */
  _formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

// =========================================================================
// EXPORT SINGLETON INSTANCE
// =========================================================================

const webAnalytics = new WebAnalyticsService();
export default webAnalytics;