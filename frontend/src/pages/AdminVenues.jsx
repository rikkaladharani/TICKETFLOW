import { API_BASE_URL, BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";

function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", address: "", city: "Hyderabad", capacity: "", layoutType: "CONCERT",
    description: "", imageUrl: ""
  });

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function createVenue(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("ticketflowToken");
    if (!token) {
      setError("Please log in as Admin first.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/venues`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, capacity: Number(form.capacity) })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Could not create venue (${response.status}).`);
      setSuccess(`Venue "${data.name || form.name}" added successfully.`);
      setForm({ name: "", address: "", city: "Hyderabad", capacity: "", layoutType: "CONCERT", description: "", imageUrl: "" });
      await loadVenues();
    } catch (err) {
      setError(err.message || "Could not create venue.");
    } finally {
      setSaving(false);
    }
  }

  async function loadVenues() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("ticketflowToken");

      if (!token) {
        throw new Error("Please log in as Admin first.");
      }

      const response = await fetch(
        `${API_BASE_URL}/venues`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load venues (${response.status}).`
        );
      }

      const data = await response.json();
      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load venues.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVenues();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <span className="section-label">ADMINISTRATION</span>
            <h1>Venue Management</h1>
            <p>View venues registered on the TicketFlow platform.</p>
          </div>

          <Link to="/admin/dashboard" className="dashboard-home">
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            style={{ color: "#c62828", marginBottom: 16 }}
          >
            {error}
            <button
              type="button"
              onClick={loadVenues}
              style={{ marginLeft: 12 }}
            >
              Try again
            </button>
          </div>
        )}

        <div className="dashboard-section" style={{ marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>Add a Venue</h2>
          <p style={{ color: "#64748b", marginTop: 6 }}>Register a concert hall, stadium, auditorium or event space.</p>
          <form onSubmit={createVenue} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <label style={{ display: "grid", gap: 6 }}>Venue name *
              <input name="name" value={form.name} onChange={updateForm} required maxLength={120} placeholder="e.g. Hyderabad Arena" style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>Address *
              <input name="address" value={form.address} onChange={updateForm} required placeholder="Street / area" style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>City *
              <input name="city" value={form.city} onChange={updateForm} required placeholder="Hyderabad" style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>Capacity *
              <input name="capacity" type="number" min="1" value={form.capacity} onChange={updateForm} required placeholder="e.g. 5000" style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>Venue layout *
              <select name="layoutType" value={form.layoutType} onChange={updateForm} required style={inputStyle}>
                <option value="CONCERT">Concert</option><option value="AUDITORIUM">Auditorium</option><option value="STADIUM">Stadium</option><option value="FESTIVAL">Festival grounds</option><option value="THEATRE">Theatre</option><option value="CONFERENCE">Conference</option>
              </select>
            </label>
            <label style={{ display: "grid", gap: 6 }}>Image URL (optional)
              <input name="imageUrl" type="url" value={form.imageUrl} onChange={updateForm} placeholder="https://..." style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6, gridColumn: "1 / -1" }}>Description (optional)
              <textarea name="description" value={form.description} onChange={updateForm} rows={2} placeholder="Describe the venue" style={{ ...inputStyle, resize: "vertical" }} />
            </label>
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" disabled={saving} style={{ background: "#2563eb", color: "white", border: 0, borderRadius: 8, padding: "11px 18px", fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>{saving ? "Saving venue..." : "+ Add Venue"}</button>
            </div>
          </form>
          {success && <p role="status" style={{ color: "#15803d", marginBottom: 0 }}>{success}</p>}
        </div>

        <div className="dashboard-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <h2>All Venues ({venues.length})</h2>

            <button
              type="button"
              onClick={loadVenues}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <p>Loading venues...</p>
          ) : venues.length === 0 ? (
            <p>No venues found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ padding: 12, textAlign: "left" }}>
                      ID
                    </th>
                    <th style={{ padding: 12, textAlign: "left" }}>
                      Venue Name
                    </th>
                    <th style={{ padding: 12, textAlign: "left" }}>
                      City
                    </th>
                    <th style={{ padding: 12, textAlign: "left" }}>
                      Capacity
                    </th>
                    <th style={{ padding: 12, textAlign: "left" }}>
                      Layout
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {venues.map((venue) => (
                    <tr key={venue.id}>
                      <td style={{ padding: 12 }}>{venue.id}</td>
                      <td style={{ padding: 12 }}>
                        <strong>{venue.name || "—"}</strong>
                      </td>
                      <td style={{ padding: 12 }}>
                        {venue.city || "—"}
                      </td>
                      <td style={{ padding: 12 }}>
                        {venue.capacity ?? "—"}
                      </td>
                      <td style={{ padding: 12 }}>
                        {venue.layoutType || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: 8,
  padding: "11px 12px", background: "white", color: "#0f172a", font: "inherit"
};

export default AdminVenues;