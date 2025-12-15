"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface RealtimeContextType {
  isConnected: boolean;
  subscribeToCampaign: (campaignId: number) => void;
  unsubscribeFromCampaign: (campaignId: number) => void;
  broadcastDonation: (campaignId: number, donation: any) => Promise<void>;
  onlineUsers: number;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected] = useState(false);
  const [onlineUsers] = useState(0);
  const [connectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("disconnected");

  const subscribeToCampaign = useCallback((campaignId: number) => {
    console.log(`Real-time subscription to campaign ${campaignId} not yet implemented`);
  }, []);

  const unsubscribeFromCampaign = useCallback((campaignId: number) => {
    console.log(`Real-time unsubscription from campaign ${campaignId} not yet implemented`);
  }, []);

  const broadcastDonation = useCallback(async (campaignId: number, donation: any) => {
    console.log(`Broadcasting donation for campaign ${campaignId} not yet implemented`);
  }, []);

  const value: RealtimeContextType = {
    isConnected,
    subscribeToCampaign,
    unsubscribeFromCampaign,
    broadcastDonation,
    onlineUsers,
    connectionStatus,
  };

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
}
