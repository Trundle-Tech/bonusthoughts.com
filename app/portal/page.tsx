"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, serverTimestamp, writeBatch, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, LogOut, Package, MessageSquarePlus, CheckCircle2, Shield } from "lucide-react";

interface Product {
  id: string;
  name: string;
  status: "Active" | "Maintenance" | "Deploying";
  version: string;
  nextRenewal: string;
}

export default function PortalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      try {
        // --- 0. SYNC USER DATA & CHECK ADMIN ---
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        // Always ensure email is synced to Firestore so Admin can find this user
        await setDoc(userDocRef, { 
          email: currentUser.email,
          lastSeen: serverTimestamp() 
        }, { merge: true });

        if (userDocSnap.exists() && userDocSnap.data().isAdmin) {
          setIsAdmin(true);
        }

        // --- 1. CHECK FOR PENDING PRODUCTS (Pre-provisioned by email) ---
        const pendingRef = collection(db, "pending_products");
        const q = query(pendingRef, where("targetEmail", "==", currentUser.email));
        const pendingSnapshot = await getDocs(q);

        if (!pendingSnapshot.empty) {
          const batch = writeBatch(db);
          const userProductsRef = collection(db, "users", currentUser.uid, "products");

          pendingSnapshot.forEach((pendingDoc) => {
            const data = pendingDoc.data();
            const newDocRef = doc(userProductsRef); 
            batch.set(newDocRef, {
              name: data.name,
              status: data.status,
              version: data.version,
              nextRenewal: data.nextRenewal,
              createdAt: serverTimestamp()
            });
            batch.delete(pendingDoc.ref);
          });

          await batch.commit();
        }

        // --- 2. FETCH USER'S PRODUCTS ---
        const productsRef = collection(db, "users", currentUser.uid, "products");
        const snapshot = await getDocs(productsRef);
        
        if (snapshot.empty) {
          setProducts([]); 
        } else {
          const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setProducts(productList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProduct) return;
    
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, "requests"), {
        userId: user.uid,
        userEmail: user.email,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        message: requestMessage,
        status: "pending",
        createdAt: serverTimestamp()
      });
      
      setSuccessMsg("Request received. Ticket #T-" + Math.floor(Math.random() * 10000));
      setRequestMessage("");
      setTimeout(() => {
        setSelectedProduct(null);
        setSuccessMsg("");
      }, 2000);
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191919] flex items-center justify-center text-[#4a7c59]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191919] text-[#F4EDE4]">
      <nav className="border-b border-[#F4EDE4]/10 bg-[#191919]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#4a7c59] animate-pulse" />
            <span className="font-bold text-lg tracking-tight">BonusThoughts Portal</span>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/admin")}
                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Console
              </Button>
            )}
            <span className="text-xs text-[#D4C4B0] hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[#D4C4B0] hover:text-[#F4EDE4]">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Active Deployments</h1>
          <p className="text-[#D4C4B0]">Manage your subscribed systems and request support.</p>
        </div>

        {products.length === 0 ? (
           <div className="text-center py-12 border border-dashed border-[#F4EDE4]/10 rounded-xl">
             <p className="text-[#D4C4B0]">No active deployments found.</p>
             <p className="text-sm text-[#D4C4B0]/50 mt-2">Contact support if you believe this is an error.</p>
           </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#F4EDE4]/5 border-[#F4EDE4]/10 hover:border-[#4a7c59]/50 transition-all group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-medium text-[#F4EDE4]">{product.name}</CardTitle>
                    <Package className="w-5 h-5 text-[#4a7c59]" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#D4C4B0]">Status</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                          product.status === 'Active' 
                            ? 'bg-[#4a7c59]/20 text-[#4a7c59] border-[#4a7c59]/30' 
                            : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#D4C4B0]">Version</span>
                        <span className="font-mono text-[#F4EDE4]">{product.version}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#D4C4B0]">Renewal</span>
                        <span className="text-[#F4EDE4]">{product.nextRenewal}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-[#F4EDE4]/10 hover:bg-[#4a7c59] hover:text-[#191919] transition-all border border-[#F4EDE4]/20"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <MessageSquarePlus className="w-4 h-4 mr-2" />
                      Submit Request
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg"
            >
              <Card className="bg-[#191919] border-[#4a7c59]/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-[#F4EDE4]">Submit Request</CardTitle>
                  <CardDescription className="text-[#D4C4B0]/80">
                    System: <span className="text-[#4a7c59] font-medium">{selectedProduct.name}</span>
                  </CardDescription>
                </CardHeader>
                
                {!successMsg ? (
                  <form onSubmit={handleSubmitRequest}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Issue or Feature Request</Label>
                        <textarea
                          required
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                          className="flex min-h-[120px] w-full rounded-md border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-3 py-2 text-sm text-[#F4EDE4] placeholder:text-[#D4C4B0]/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4a7c59]"
                          placeholder="Describe the functionality you need or the issue you are facing..."
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                      <Button variant="ghost" type="button" onClick={() => setSelectedProduct(null)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={submitting}
                        className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] text-[#191919]"
                      >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Ticket"}
                      </Button>
                    </CardFooter>
                  </form>
                ) : (
                  <div className="p-8 text-center">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-[#4a7c59]/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle2 className="w-8 h-8 text-[#4a7c59]" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-[#F4EDE4] mb-2">Request Submitted</h3>
                    <p className="text-[#D4C4B0]">{successMsg}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}