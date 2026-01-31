"use client";

import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, getDocs, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, PlusCircle, ShieldAlert, CheckCircle2, ArrowLeft, Search, Trash2, Edit2, Save, X, AlertCircle, UserCheck, Mail, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

// Type definition for a product in the admin view
interface AdminProduct {
  id: string;
  path: string; 
  name: string;
  status: string;
  version: string;
  nextRenewal: string;
  type: "Active" | "Pending";
}

interface UserProfile {
  uid: string;
  email: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Deployment Form State
  const [deployMode, setDeployMode] = useState<"existing" | "new">("existing");
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  
  // Search-as-you-type states
  const [targetDisplay, setTargetDisplay] = useState(""); // What's shown in the input
  const [targetIdentifier, setTargetIdentifier] = useState(""); // The actual UID or Email value
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false);

  const [productName, setProductName] = useState("");
  const [productVersion, setProductVersion] = useState("");
  const [status, setStatus] = useState("Active");
  const [renewalDate, setRenewalDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  // Management State
  const [manageIdentifier, setManageIdentifier] = useState("");
  const [showManageSuggestions, setShowManageSuggestions] = useState(false);
  
  const [fetchedProducts, setFetchedProducts] = useState<AdminProduct[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminProduct>>({});

  // Refs for clicking outside to close dropdowns
  const targetWrapperRef = useRef<HTMLDivElement>(null);
  const manageWrapperRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists() && userDocSnap.data().isAdmin) {
          setUser(currentUser);
          setIsAdmin(true);
          fetchUsers(); 
        } else {
          router.push("/portal");
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.push("/portal");
      } finally {
        setLoading(false);
      }
    });

    // Click outside listener to close dropdowns
    function handleClickOutside(event: MouseEvent) {
      if (targetWrapperRef.current && !targetWrapperRef.current.contains(event.target as Node)) {
        setShowTargetSuggestions(false);
      }
      if (manageWrapperRef.current && !manageWrapperRef.current.contains(event.target as Node)) {
        setShowManageSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [router]);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const usersList: UserProfile[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.email) {
          usersList.push({ uid: doc.id, email: data.email });
        }
      });
      setAllUsers(usersList);
    } catch (e) {
      console.error("Error fetching users list", e);
    }
  };

  // --- SMART INPUT HANDLERS ---

  // Filter users for Deployment Target
  const filteredTargetUsers = allUsers.filter(u => 
    u.email.toLowerCase().includes(targetDisplay.toLowerCase())
  );

  const selectTargetUser = (u: UserProfile) => {
    setTargetDisplay(u.email);
    setTargetIdentifier(u.uid);
    setShowTargetSuggestions(false);
  };

  // Filter users for Manage Search
  const filteredManageUsers = allUsers.filter(u => 
    u.email.toLowerCase().includes(manageIdentifier.toLowerCase())
  );

  const selectManageUser = (email: string) => {
    setManageIdentifier(email);
    setShowManageSuggestions(false);
  };


  // --- CREATE NEW DEPLOYMENT ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess("");

    try {
      if (deployMode === "new") {
        // PENDING (EMAIL) - Use the display value directly as it IS the email
        if (!targetDisplay.includes("@")) throw new Error("Invalid email address");
        
        await addDoc(collection(db, "pending_products"), {
          targetEmail: targetDisplay.toLowerCase().trim(),
          name: productName,
          status: status,
          version: productVersion,
          nextRenewal: renewalDate,
          createdAt: serverTimestamp()
        });
        setSuccess(`Queued ${productName} for ${targetDisplay}.`);
      } else {
        // EXISTING (UID)
        if (!targetIdentifier) throw new Error("No user selected from list");
        
        const userProductsRef = collection(db, "users", targetIdentifier, "products");
        await addDoc(userProductsRef, {
          name: productName,
          status: status,
          version: productVersion,
          nextRenewal: renewalDate,
          createdAt: serverTimestamp()
        });
        setSuccess(`Deployed ${productName} to user account.`);
      }

      setProductName("");
      setProductVersion("");
      setRenewalDate("");
    } catch (error: any) {
      console.error("Error adding product:", error);
      alert(error.message || "Failed to add product. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FETCH EXISTING DEPLOYMENTS ---
  const handleFetchDeployments = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    setFetchedProducts([]);
    setEditingId(null);

    try {
      const results: AdminProduct[] = [];
      const searchTerm = manageIdentifier.toLowerCase().trim();

      if (searchTerm.includes("@")) {
        // 1. Fetch Pending Products (by Email)
        const pendingRef = collection(db, "pending_products");
        const q = query(pendingRef, where("targetEmail", "==", searchTerm));
        const pendingSnapshot = await getDocs(q);
        
        pendingSnapshot.forEach(doc => {
          results.push({
            id: doc.id,
            path: `pending_products/${doc.id}`,
            type: "Pending",
            ...doc.data()
          } as AdminProduct);
        });

        // 2. Fetch Active Products (Resolve Email -> UID -> Products)
        const foundUser = allUsers.find(u => u.email.toLowerCase() === searchTerm);
        if (foundUser) {
          const productsRef = collection(db, "users", foundUser.uid, "products");
          const activeSnapshot = await getDocs(productsRef);

          activeSnapshot.forEach(doc => {
            results.push({
              id: doc.id,
              path: `users/${foundUser.uid}/products/${doc.id}`,
              type: "Active",
              ...doc.data()
            } as AdminProduct);
          });
        }

      } else {
        // Fetch Active Products (Directly by UID)
        const productsRef = collection(db, "users", manageIdentifier.trim(), "products");
        const snapshot = await getDocs(productsRef);

        snapshot.forEach(doc => {
          results.push({
            id: doc.id,
            path: `users/${manageIdentifier.trim()}/products/${doc.id}`,
            type: "Active",
            ...doc.data()
          } as AdminProduct);
        });
      }

      setFetchedProducts(results);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error fetching products. Ensure UID or Email is correct.");
    } finally {
      setIsFetching(false);
    }
  };

  // --- DELETE DEPLOYMENT ---
  const handleDelete = async (product: AdminProduct) => {
    if (!confirm(`Are you sure you want to delete ${product.name}? This cannot be undone.`)) return;

    try {
      await deleteDoc(doc(db, product.path.split("/")[0], ...product.path.split("/").slice(1)));
      setFetchedProducts(prev => prev.filter(p => p.id !== product.id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product.");
    }
  };

  // --- EDIT DEPLOYMENT ---
  const startEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.path) return;

    try {
      const pathParts = editForm.path.split("/");
      const docRef = doc(db, pathParts[0], ...pathParts.slice(1));

      await updateDoc(docRef, {
        name: editForm.name,
        status: editForm.status,
        version: editForm.version,
        nextRenewal: editForm.nextRenewal
      });

      setFetchedProducts(prev => prev.map(p => 
        p.id === editingId ? { ...p, ...editForm } as AdminProduct : p
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update product.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#191919] flex items-center justify-center text-[#4a7c59]">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#191919] text-[#F4EDE4] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent">
              Deployment Console
            </h1>
            <p className="text-[#D4C4B0]">Full control over client assets.</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => router.push("/portal")}
            className="text-[#D4C4B0] hover:text-[#F4EDE4] hover:bg-[#F4EDE4]/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* LEFT COL: CREATE NEW */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#F4EDE4] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#4a7c59]" />
              New Deployment
            </h2>
            <Card className="bg-[#F4EDE4]/5 border-[#F4EDE4]/10 backdrop-blur-xl h-full">
              <CardContent className="pt-6">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  
                  {/* TARGET SELECTION TOGGLE */}
                  <div className="space-y-3">
                    <Label className="text-yellow-500">Deployment Target</Label>
                    <div className="flex gap-2 p-1 bg-[#191919] rounded-md border border-[#F4EDE4]/10">
                      <button
                        type="button"
                        onClick={() => { 
                          setDeployMode("existing"); 
                          setTargetDisplay(""); 
                          setTargetIdentifier("");
                        }}
                        className={`flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-2 transition-all ${deployMode === "existing" ? "bg-[#4a7c59] text-white" : "text-[#D4C4B0] hover:text-white"}`}
                      >
                        <UserCheck className="w-3 h-3" /> Existing User
                      </button>
                      <button
                        type="button"
                        onClick={() => { 
                          setDeployMode("new"); 
                          setTargetDisplay(""); 
                          setTargetIdentifier("");
                        }}
                        className={`flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-2 transition-all ${deployMode === "new" ? "bg-[#4a7c59] text-white" : "text-[#D4C4B0] hover:text-white"}`}
                      >
                        <Mail className="w-3 h-3" /> Pre-provision
                      </button>
                    </div>

                    <div className="relative" ref={targetWrapperRef}>
                      <Input
                        value={targetDisplay}
                        onChange={(e) => {
                          setTargetDisplay(e.target.value);
                          if (deployMode === "existing") {
                            setTargetIdentifier(""); // Clear selected UID if typing
                            setShowTargetSuggestions(true);
                          }
                        }}
                        onFocus={() => {
                          if (deployMode === "existing") setShowTargetSuggestions(true);
                        }}
                        placeholder={deployMode === "existing" ? "Search user email..." : "new.client@company.com"}
                        className="font-mono text-sm"
                        required
                      />
                      
                      {/* SMART POPULATOR DROPDOWN */}
                      {deployMode === "existing" && showTargetSuggestions && targetDisplay && (
                        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border border-[#F4EDE4]/20 bg-[#191919] shadow-lg">
                          {filteredTargetUsers.length > 0 ? (
                            filteredTargetUsers.map((u) => (
                              <button
                                key={u.uid}
                                type="button"
                                onClick={() => selectTargetUser(u)}
                                className="w-full text-left px-3 py-2 text-sm text-[#F4EDE4] hover:bg-[#4a7c59]/20 transition-colors"
                              >
                                {u.email}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-xs text-[#D4C4B0]/50">No matching users found.</div>
                          )}
                        </div>
                      )}
                    </div>
                    {deployMode === "existing" && !targetIdentifier && targetDisplay.length > 0 && (
                      <p className="text-[10px] text-red-400 px-1 animate-pulse">
                        * Please select a user from the dropdown
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="AI Overwatch"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-3 py-1 text-sm text-[#F4EDE4] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4a7c59]"
                      >
                        <option value="Active">Active</option>
                        <option value="Deploying">Deploying</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Version</Label>
                      <Input
                        value={productVersion}
                        onChange={(e) => setProductVersion(e.target.value)}
                        placeholder="v1.0.0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Next Renewal</Label>
                      <Input
                        type="date"
                        value={renewalDate}
                        onChange={(e) => setRenewalDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {success && (
                    <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-900/50 rounded-md text-green-400 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      {success}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting || (deployMode === "existing" && !targetIdentifier)}
                    className="w-full bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] text-[#191919] mt-4"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deploy Product"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COL: MANAGE EXISTING */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#F4EDE4] flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Manage Deployments
            </h2>
            
            <Card className="bg-[#191919] border-[#F4EDE4]/10 h-full">
              <CardHeader>
                <CardDescription className="text-[#D4C4B0]">
                  Search by <strong>Email</strong> to find and edit active products.
                </CardDescription>
                <form onSubmit={handleFetchDeployments} className="mt-2 relative" ref={manageWrapperRef}>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input 
                        value={manageIdentifier}
                        onChange={(e) => {
                          setManageIdentifier(e.target.value);
                          setShowManageSuggestions(true);
                        }}
                        onFocus={() => setShowManageSuggestions(true)}
                        placeholder="Search by Email..."
                        className="font-mono text-sm"
                      />
                      
                      {/* SEARCH SUGGESTIONS */}
                      {showManageSuggestions && manageIdentifier && (
                        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border border-[#F4EDE4]/20 bg-[#191919] shadow-lg">
                          {filteredManageUsers.length > 0 ? (
                            filteredManageUsers.map((u) => (
                              <button
                                key={u.uid}
                                type="button"
                                onClick={() => selectManageUser(u.email)}
                                className="w-full text-left px-3 py-2 text-sm text-[#F4EDE4] hover:bg-[#4a7c59]/20 transition-colors"
                              >
                                {u.email}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-xs text-[#D4C4B0]/50">No users found.</div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Button type="submit" disabled={isFetching} variant="secondary">
                      {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
                    </Button>
                  </div>
                </form>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {fetchedProducts.length === 0 && !isFetching && (
                  <div className="text-center py-8 text-[#D4C4B0]/40 text-sm italic">
                    No deployments found.
                  </div>
                )}

                {fetchedProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="p-4 rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 transition-all hover:border-[#F4EDE4]/20"
                  >
                    {editingId === product.id ? (
                      // EDIT MODE
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-mono text-yellow-500">Editing...</span>
                        </div>
                        <Input 
                          value={editForm.name} 
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          placeholder="Name"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                            className="flex h-9 w-full rounded-md border border-[#F4EDE4]/20 bg-[#191919] px-3 py-1 text-sm text-[#F4EDE4]"
                          >
                            <option value="Active">Active</option>
                            <option value="Deploying">Deploying</option>
                            <option value="Maintenance">Maintenance</option>
                          </select>
                          <Input 
                            value={editForm.version} 
                            onChange={(e) => setEditForm({...editForm, version: e.target.value})}
                            placeholder="Version"
                          />
                        </div>
                        <Input 
                          type="date"
                          value={editForm.nextRenewal} 
                          onChange={(e) => setEditForm({...editForm, nextRenewal: e.target.value})}
                        />
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={saveEdit} className="w-full bg-[#4a7c59] hover:bg-[#5a8a65]">
                            <Save className="w-4 h-4 mr-2" /> Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // VIEW MODE
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-[#F4EDE4]">{product.name}</h4>
                            <div className="flex gap-2 mt-1">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                product.type === 'Pending' ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' : 'border-[#4a7c59]/50 text-[#4a7c59] bg-[#4a7c59]/10'
                              }`}>
                                {product.type}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#D4C4B0]/20 text-[#D4C4B0]">
                                {product.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon-sm" variant="ghost" onClick={() => startEdit(product)} className="text-[#D4C4B0] hover:text-white">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(product)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-[#D4C4B0]/70 mt-3 font-mono">
                          <div>v{product.version}</div>
                          <div className="text-right">Renews: {product.nextRenewal}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}