"use client";

import React, { useState } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status?: string;
  created_at: string;
}

interface LeadsDashboardProps {
  leads?: Lead[];
  leadStages: string[];
  updateLeadStatus: (leadId: string, newStatus: string) => Promise<void>;
  updateLeadStages: (newStages: string[], renamedMap?: { [old: string]: string }, deletedStages?: string[]) => Promise<void>;
}

export function LeadsDashboard({
  leads = [],
  leadStages,
  updateLeadStatus,
  updateLeadStages
}: LeadsDashboardProps) {
  const [search, setSearch] = useState("");
  const [showStageManager, setShowStageManager] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [updating, setUpdating] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const term = search.toLowerCase();
    const matchesSearch = (
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      (lead.phone && lead.phone.toLowerCase().includes(term)) ||
      lead.message.toLowerCase().includes(term) ||
      (lead.status && lead.status.toLowerCase().includes(term))
    );
    return matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleAddStage = async () => {
    if (!newStageName.trim() || leadStages.includes(newStageName.trim())) return;
    setUpdating(true);
    try {
      const updated = [...leadStages, newStageName.trim()];
      await updateLeadStages(updated);
      setNewStageName("");
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleRenameStage = async (oldName: string) => {
    const newName = editingValue.trim();
    if (!newName || newName === oldName || leadStages.includes(newName)) {
      setEditingStage(null);
      return;
    }
    setUpdating(true);
    try {
      const updated = leadStages.map(s => s === oldName ? newName : s);
      const renamedMap = { [oldName]: newName };
      await updateLeadStages(updated, renamedMap);
      setEditingStage(null);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteStage = async (stageToDelete: string) => {
    if (leadStages.length <= 1) {
      alert("You must have at least one stage in your pipeline.");
      return;
    }
    if (!confirm(`Are you sure you want to delete stage "${stageToDelete}"? Leads in this stage will be reset to the default stage.`)) {
      return;
    }
    setUpdating(true);
    try {
      const updated = leadStages.filter(s => s !== stageToDelete);
      await updateLeadStages(updated, undefined, [stageToDelete]);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeStyle = (status?: string) => {
    const cleaned = (status || "").toLowerCase();
    const base = {
      fontSize: "0.75rem",
      fontWeight: 600,
      padding: "0.25rem 0.6rem",
      borderRadius: "9999px",
      textTransform: "uppercase" as const
    };

    if (cleaned === "new") {
      return { ...base, backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.3)" };
    }
    if (cleaned === "contacted") {
      return { ...base, backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)" };
    }
    if (cleaned === "accepted") {
      return { ...base, backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" };
    }
    if (cleaned === "rejected") {
      return { ...base, backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" };
    }
    return { ...base, backgroundColor: "rgba(255, 255, 255, 0.08)", color: "var(--muted)", border: "1px solid var(--border)" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
      
      {/* Title & Search bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>Leads Inbox</h3>
          <button 
            type="button"
            onClick={() => setShowStageManager(!showStageManager)}
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              borderRadius: "0.375rem",
              padding: "0.4rem 0.8rem",
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"}
          >
            ⚙️ Customize Pipeline Stages
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Search name, email, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            borderRadius: "var(--radius-md)",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            width: "100%",
            maxWidth: "300px",
            outline: "none"
          }}
        />
      </div>

      {/* Stage Manager Panel */}
      {showStageManager && (
        <div style={{
          padding: "1.75rem",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          position: "relative",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)"
        }}>
          {/* Header with Close Button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>CRM Pipeline Stages Settings</h4>
            <button
              type="button"
              onClick={() => setShowStageManager(false)}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                lineHeight: 1,
                paddingBottom: "2px",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.color = "var(--foreground)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "var(--muted)";
              }}
              title="Close Panel"
            >
              &times;
            </button>
          </div>
          
          {/* Stages List */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {leadStages.map((stage, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.6rem", 
                  background: "rgba(255, 255, 255, 0.03)", 
                  padding: "0.5rem 0.85rem", 
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  transition: "all 0.2s"
                }}
              >
                {editingStage === stage ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <input 
                      type="text" 
                      value={editingValue} 
                      onChange={(e) => setEditingValue(e.target.value)}
                      disabled={updating}
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--primary)",
                        color: "var(--foreground)",
                        borderRadius: "0.25rem",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.85rem",
                        width: "100px",
                        outline: "none"
                      }}
                    />
                    <button 
                      onClick={() => handleRenameStage(stage)} 
                      disabled={updating}
                      style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", fontSize: "1rem", padding: "0 0.25rem" }}
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => setEditingStage(null)} 
                      disabled={updating}
                      style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1rem", padding: "0 0.25rem" }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{stage}</span>
                    <button 
                      onClick={() => { setEditingStage(stage); setEditingValue(stage); }} 
                      disabled={updating}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "var(--muted)", 
                        cursor: "pointer", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        transition: "background-color 0.2s"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      title="Rename Stage"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteStage(stage)} 
                      disabled={updating || leadStages.length <= 1}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "#ef4444", 
                        cursor: "pointer", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        transition: "background-color 0.2s"
                      }}
                      onMouseOver={(e) => { if (leadStages.length > 1) e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)"; }}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      title="Delete Stage"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add New Stage Row */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.5rem" }}>
            <input 
              type="text"
              placeholder="e.g. In Discussion"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              disabled={updating}
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                borderRadius: "var(--radius-md)",
                padding: "0.6rem 1rem",
                fontSize: "0.875rem",
                width: "100%",
                maxWidth: "240px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
            />
            <button
              onClick={handleAddStage}
              disabled={updating || !newStageName.trim()}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                padding: "0.6rem 1.2rem",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
                opacity: (!newStageName.trim() || updating) ? 0.5 : 1
              }}
            >
              Add Stage
            </button>
          </div>
        </div>
      )}

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div style={{
          padding: "3rem 1rem",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-md)",
          color: "var(--muted)"
        }}>
          {leads.length === 0 ? "No leads or inquiries received yet." : "No leads match your search."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              style={{
                padding: "1.5rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                transition: "transform 0.2s, background-color 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
              }}
            >
              {/* Header: Name, Badge & Status Dropdown Selector */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>{lead.name}</h4>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.25rem", fontSize: "0.85rem", color: "var(--muted)" }}>
                    <span>✉️ <a href={`mailto:${lead.email}`} style={{ color: "var(--primary)", textDecoration: "underline" }}>{lead.email}</a></span>
                    {lead.phone && <span>📞 <a href={`tel:${lead.phone}`} style={{ color: "inherit", textDecoration: "none" }}>{lead.phone}</a></span>}
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  {/* Status Dropdown Selector */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Status:</span>
                    <select
                      value={lead.status || leadStages[0]}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        borderRadius: "0.25rem",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      {leadStages.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Status Color Badge */}
                  <span style={getStatusBadgeStyle(lead.status || leadStages[0])}>
                    {lead.status || leadStages[0]}
                  </span>
                  
                  {/* Submission Time */}
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", background: "rgba(255, 255, 255, 0.05)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>
                    {formatDate(lead.created_at)}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div style={{
                padding: "1rem",
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                color: "var(--secondary-foreground)",
                whiteSpace: "pre-wrap",
                borderLeft: "3px solid var(--primary)"
              }}>
                {lead.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
