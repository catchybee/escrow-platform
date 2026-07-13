import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

// --- Components ---

const LoginPage = () => {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth(); // Pulling the live auth state
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // This useEffect watches the authentication state. 
  // The moment Convex confirms login is successful, it navigates to /create.
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/create");
    }
  }, [isAuthenticated, navigate]);

  const handleAuth = async (flow: "signIn" | "signUp") => {
    try {
      await signIn("password", { email, password, flow });
      // We removed the manual navigate() from here to avoid the race condition!
    } catch (error) {
      console.error("Auth failed:", error);
      alert("Authentication failed. Please check your details.");
    }
  };

  return (
    <div style={{ padding: "100px", textAlign: "center", background: "#F5F5DC", minHeight: "100vh", color: "#333", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "40px", color: "#2c3e50" }}>Escrow Platform</h1>
      
      <div style={{ maxWidth: "400px", margin: "0 auto", background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ display: "block", marginBottom: "20px", padding: "15px", borderRadius: "8px", width: "100%", boxSizing: "border-box", color: "black", border: "1px solid #ccc", fontSize: "16px" }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ display: "block", marginBottom: "30px", padding: "15px", borderRadius: "8px", width: "100%", boxSizing: "border-box", color: "black", border: "1px solid #ccc", fontSize: "16px" }} 
        />
        
        <div style={{ display: "flex", gap: "15px" }}>
          <button onClick={() => handleAuth("signIn")} style={{ flex: 1, padding: "15px", background: "#3498db", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>Login</button>
          <button onClick={() => handleAuth("signUp")} style={{ flex: 1, padding: "15px", background: "#2ecc71", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) return <div style={{ background: "#F5F5DC", minHeight: "100vh", padding: "40px", color: "#333" }}>Loading...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuthActions();
  return (
    <div style={{ minHeight: "100vh", background: "#F5F5DC", color: "#333", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <h2 style={{ color: "#2c3e50", margin: 0 }}>Escrow Platform</h2>
          <Link to="/create" style={{ color: "#3498db", textDecoration: "none", fontWeight: "bold" }}>Create Project</Link>
          <Link to="/projects" style={{ color: "#3498db", textDecoration: "none", fontWeight: "bold" }}>ACTIVE PROJECTS</Link>
          <Link to="/about" style={{ color: "#3498db", textDecoration: "none", fontWeight: "bold" }}>About Us</Link>
        </div>
        <button onClick={() => void signOut()} style={{ background: "#e74c3c", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Sign Out</button>
      </nav>
      <div style={{ padding: "40px" }}>{children}</div>
    </div>
  );
};

const CreateProject = () => {
  const navigate = useNavigate();
  const createProject = useMutation(api.myFunctions.createProject);
  
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [m3, setM3] = useState("");
  const [m4, setM4] = useState("");

  const handleDeploy = async () => {
    if (!title || !email || !budget || !m1 || !m2 || !m3 || !m4) {
      alert("Please fill out all fields before deploying.");
      return;
    }

    const total = parseFloat(budget);
    const quarter = total / 4;

    const milestones = [
      { description: m1, amount: quarter },
      { description: m2, amount: quarter },
      { description: m3, amount: quarter },
      { description: m4, amount: quarter },
    ];

    await createProject({ 
      title, 
      freelancerEmail: email, 
      totalBudget: total, 
      milestones 
    });
    
    navigate("/projects");
  };

  const inputStyle = { display: "block", marginBottom: "20px", padding: "15px", width: "100%", maxWidth: "500px", borderRadius: "8px", color: "black", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" as const };

  return (
    <Layout>
      <div style={{ maxWidth: "600px", background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
        <h2 style={{ marginBottom: "30px", color: "#2c3e50" }}>Create New Project</h2>
        
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Project Name</label>
        <input placeholder="Enter project title" onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
        
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Freelancer Email</label>
        <input type="email" placeholder="freelancer@example.com" onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Total Budget ($)</label>
        <input type="number" placeholder="e.g. 1000" onChange={(e) => setBudget(e.target.value)} style={inputStyle} />
        
        <hr style={{ margin: "30px 0", borderTop: "1px solid #eee" }} />
        <h3 style={{ marginBottom: "20px", color: "#2c3e50" }}>Define 4 Milestones (25% Budget Each)</h3>
        
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Milestone 1 Name</label>
        <input placeholder="e.g. Wireframes" onChange={(e) => setM1(e.target.value)} style={inputStyle} />
        
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Milestone 2 Name</label>
        <input placeholder="e.g. Frontend UI" onChange={(e) => setM2(e.target.value)} style={inputStyle} />
        
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Milestone 3 Name</label>
        <input placeholder="e.g. Backend Integration" onChange={(e) => setM3(e.target.value)} style={inputStyle} />
        
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Milestone 4 Name</label>
        <input placeholder="e.g. Final Delivery" onChange={(e) => setM4(e.target.value)} style={inputStyle} />

        <button onClick={handleDeploy} style={{ marginTop: "20px", padding: "15px 30px", background: "#2ecc71", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", width: "100%", maxWidth: "500px" }}>
          Create & Deploy Escrow
        </button>
      </div>
    </Layout>
  );
};

const ActiveProjects = () => {
  const projects = useQuery(api.myFunctions.getProjects);
  
  return (
    <Layout>
      <h1 style={{ color: "#2c3e50", marginBottom: "30px" }}>Active Projects</h1>
      
      {projects && projects.length === 0 && (
        <p>No active projects found. Go to Create Project to start one.</p>
      )}

      {projects?.map((p: any) => (
        <div key={p._id} style={{ background: "white", border: "1px solid #ddd", padding: "30px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h2 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>{p.title}</h2>
          <p style={{ color: "#7f8c8d", marginBottom: "20px" }}>Freelancer: {p.freelancerEmail} | Total Budget: ${p.totalBudget}</p>
          
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {p.milestones.map((m: any, i: number) => (
              <div key={i} style={{ flex: "1 1 200px", padding: "20px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #eee" }}>
                <h4 style={{ margin: "0 0 10px 0" }}>{m.description}</h4>
                <p style={{ margin: "0 0 20px 0", fontWeight: "bold", color: "#27ae60" }}>${m.amount} (25%)</p>
                <button 
                  onClick={() => alert("this is a test project")}
                  style={{ width: "100%", background: "#f39c12", border: "none", color: "white", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Approve and Pay
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Layout>
  );
};

const AboutUs = () => {
  return (
    <Layout>
      <div style={{ maxWidth: "800px", background: "white", padding: "50px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", lineHeight: "1.8" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "20px" }}>About Escrow Platform</h1>
        <p style={{ fontSize: "1.1rem", color: "#444" }}>
          Welcome to the Escrow Platform, a secure and transparent payment bridge designed specifically for clients and freelancers. Our goal is to build trust and eliminate the financial risks associated with freelance work.
        </p>
        <p style={{ fontSize: "1.1rem", color: "#444" }}>
          <strong>What it can do:</strong><br />
          This platform allows a client to create a new project and assign a specific freelancer to it. Instead of paying the entire sum upfront or waiting until the very end, the total project budget is strictly divided into four equal 25% milestones. The client dictates the goals for each milestone.
        </p>
        <p style={{ fontSize: "1.1rem", color: "#444", marginBottom: "40px" }}>
          As the freelancer completes the work, the client can review the progress. Upon satisfaction, the client presses "Approve and Pay" to release the funds securely held by our escrow system directly to the freelancer. This ensures that the freelancer is guaranteed payment for completed work, and the client only pays when the agreed-upon standards are met.
        </p>
        
        <hr style={{ borderTop: "1px solid #eee", margin: "40px 0" }} />
        
        <div style={{ color: "#7f8c8d", fontStyle: "italic" }}>
          <p style={{ margin: 0 }}>Created by Team HackDot</p>
          <p style={{ margin: 0 }}>-Deepak kumar</p>
          <p style={{ margin: 0 }}>-Himanshu Pathak</p>
        </div>
      </div>
    </Layout>
  );
};

// --- App Root ---

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ActiveProjects /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}