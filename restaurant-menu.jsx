import { useState } from "react";

const KITCHEN_PIN = "1234";
const ADMIN_PIN = "9999";
const EMOJIS = ["🍚","🍳","🥘","🫕","🍲","🫙","🟡","🥢","🍢","🫖","🍹","🥤","🍗","🥩","🍜","🫔","🥗","🍱","🧆","🥞","☕","🧃","🍔","🌮","🍖","🥦","🫘","🍛","🥙","🧇"];
const TABLE_NUMBERS = ["Table 1","Table 2","Table 3","Table 4","Table 5","Table 6","Takeaway"];

const DEFAULT_MENU = {
  "Rice Dishes": [
    { id: 1, name: "Jollof Rice", price: 2500, qty: 50, desc: "Party-style smoky jollof with chicken", emoji: "🍚", available: true },
    { id: 2, name: "Fried Rice", price: 2500, qty: 40, desc: "Mixed veggies, egg & choice of protein", emoji: "🍳", available: true },
    { id: 3, name: "White Rice & Stew", price: 2000, qty: 30, desc: "Native tomato stew with assorted meat", emoji: "🥘", available: true },
  ],
  "Swallow": [
    { id: 4, name: "Eba & Egusi Soup", price: 2200, qty: 20, desc: "Thick egusi with stockfish & assorted", emoji: "🫕", available: true },
    { id: 5, name: "Pounded Yam & Ofe Onugbu", price: 2800, qty: 15, desc: "Bitter leaf soup, fresh fish & goat meat", emoji: "🍲", available: true },
    { id: 6, name: "Amala & Gbegiri", price: 2200, qty: 18, desc: "Yoruba classic with ewedu & beef", emoji: "🫙", available: true },
  ],
  "Small Chops": [
    { id: 7, name: "Puff Puff (10 pcs)", price: 800, qty: 60, desc: "Freshly fried, golden & fluffy", emoji: "🟡", available: true },
    { id: 8, name: "Spring Rolls (5 pcs)", price: 1200, qty: 35, desc: "Crispy with spiced vegetable filling", emoji: "🥢", available: true },
    { id: 9, name: "Suya Skewers (3 pcs)", price: 1500, qty: 25, desc: "Spiced beef with yaji & onions", emoji: "🍢", available: true },
  ],
  "Drinks": [
    { id: 10, name: "Zobo (Large)", price: 600, qty: 80, desc: "Hibiscus drink with ginger & cloves", emoji: "🫖", available: true },
    { id: 11, name: "Chapman", price: 1000, qty: 40, desc: "Classic Nigerian cocktail with grenadine", emoji: "🍹", available: true },
    { id: 12, name: "Chilled Malt", price: 500, qty: 100, desc: "Cold Malta or Amstel Malt", emoji: "🥤", available: true },
  ],
};

const s = {
  input: {
    width: "100%", boxSizing: "border-box",
    background: "#120d04", border: "1px solid #3a2e18",
    borderRadius: 10, padding: "10px 14px",
    color: "#f5f0e8", fontSize: 14, fontFamily: "Georgia, serif",
    outline: "none",
  },
  btnGold: {
    background: "linear-gradient(135deg,#c8860a,#e8a020)",
    border: "none", borderRadius: 10, padding: "10px 18px",
    color: "#000", fontWeight: "bold", fontSize: 13,
    cursor: "pointer", fontFamily: "Georgia, serif",
  },
  btnOutline: (color="#c8860a") => ({
    background: "transparent", border: `1px solid ${color}`,
    borderRadius: 8, padding: "6px 12px",
    color, fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif",
  }),
  card: {
    background: "#1a1208", border: "1px solid #2a1e08",
    borderRadius: 14, padding: 14,
  },
};

export default function App() {
  const [view, setView] = useState("menu");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [table, setTable] = useState("Table 1");
  const [activeCategory, setActiveCategory] = useState("Rice Dishes");
  const [toast, setToast] = useState(null);

  // Auth
  const [kitchenPin, setKitchenPin] = useState("");
  const [kitchenErr, setKitchenErr] = useState(false);
  const [kitchenOpen, setKitchenOpen] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminErr, setAdminErr] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Menu & Settings
  const [menu, setMenu] = useState(DEFAULT_MENU);
  const [adminTab, setAdminTab] = useState("items");
  const [newItem, setNewItem] = useState({ name:"", price:"", qty:"", desc:"", emoji:"🍚", category:"Rice Dishes" });
  const [newCat, setNewCat] = useState("");
  const [whatsapp, setWhatsapp] = useState("2348100000000");
  const [restName, setRestName] = useState("Mama's Kitchen");
  const [restSub, setRestSub] = useState("Abuja • Est. 2018");
  const [settingsSaved, setSettingsSaved] = useState(false);

  const showToast = (msg, color="#22c55e") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // Cart helpers
  const addToCart = (item) => setCart(p => {
    const ex = p.find(c => c.id === item.id);
    return ex ? p.map(c => c.id===item.id ? {...c,qty:c.qty+1} : c) : [...p,{...item,qty:1}];
  });
  const removeFromCart = (id) => setCart(p => {
    const ex = p.find(c => c.id===id);
    return ex?.qty===1 ? p.filter(c=>c.id!==id) : p.map(c=>c.id===id?{...c,qty:c.qty-1}:c);
  });
  const cartCount = cart.reduce((s,c)=>s+c.qty,0);
  const cartTotal = cart.reduce((s,c)=>s+c.price*c.qty,0);

  // WhatsApp
  const sendWhatsApp = (order) => {
    const lines = order.items.map(i=>`${i.emoji} ${i.name} x${i.qty} = ₦${(i.price*i.qty).toLocaleString()}`).join("%0A");
    const msg = `🔔 *NEW ORDER — ${restName}*%0A%0A📍 *${order.table}*%0A🕐 ${order.time}%0A%0A${lines}%0A%0A━━━━━━━━━━━%0A💰 *TOTAL: ₦${order.total.toLocaleString()}*%0A%0AReply DONE when ready ✅`;
    const num = whatsapp.replace(/\D/g,"");
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  // Place order
  const placeOrder = () => {
    if (!cart.length) return;
    const order = {
      id: Date.now(), table, items:[...cart], total:cartTotal,
      time: new Date().toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"}),
      status: "Pending",
    };
    // Reduce qty in menu
    setMenu(prev => {
      const updated = {...prev};
      for (const cat in updated) {
        updated[cat] = updated[cat].map(item => {
          const ordered = cart.find(c=>c.id===item.id);
          if (ordered) {
            const newQty = Math.max(0, item.qty - ordered.qty);
            return { ...item, qty: newQty, available: newQty > 0 };
          }
          return item;
        });
      }
      return updated;
    });
    setOrders(p=>[order,...p]);
    setCart([]);
    sendWhatsApp(order);
    showToast("✓ Order sent! WhatsApp opening...");
    setView("menu");
  };

  const updateStatus = (id, status) =>
    setOrders(p=>p.map(o=>o.id===id?{...o,status}:o));
  const statusColor = s => s==="Pending"?"#f59e0b":s==="Preparing"?"#3b82f6":"#22c55e";

  // Auth handlers
  const tryKitchen = () => {
    if (kitchenPin===KITCHEN_PIN){setKitchenOpen(true);setKitchenErr(false);}
    else{setKitchenErr(true);setKitchenPin("");}
  };
  const tryAdmin = () => {
    if (adminPin===ADMIN_PIN){setAdminOpen(true);setAdminErr(false);}
    else{setAdminErr(true);setAdminPin("");}
  };

  // Menu management
  const toggleAvail = (cat, id) => setMenu(p=>({
    ...p, [cat]: p[cat].map(i=>i.id===id?{...i,available:!i.available}:i)
  }));
  const deleteItem = (cat, id) => setMenu(p=>({
    ...p, [cat]: p[cat].filter(i=>i.id!==id)
  }));
  const updateField = (cat, id, field, val) => setMenu(p=>({
    ...p, [cat]: p[cat].map(i=>i.id===id?{...i,[field]:field==="price"||field==="qty"?parseInt(val)||0:val}:i)
  }));
  const addItem = () => {
    if (!newItem.name||!newItem.price||!newItem.category) return;
    const item = { id:Date.now(), name:newItem.name, price:parseInt(newItem.price)||0,
      qty:parseInt(newItem.qty)||0, desc:newItem.desc, emoji:newItem.emoji, available:true };
    setMenu(p=>({...p,[newItem.category]:[...(p[newItem.category]||[]),item]}));
    setNewItem({name:"",price:"",qty:"",desc:"",emoji:"🍚",category:newItem.category});
    showToast("✓ Item added to menu!");
  };
  const addCategory = () => {
    if (!newCat||menu[newCat]) return;
    setMenu(p=>({...p,[newCat]:[]}));
    setNewCat("");
    showToast("✓ Category added!");
  };

  const allAvailCategories = Object.keys(menu).filter(c=>menu[c].some(i=>i.available));

  // PIN lock screen
  const PinScreen = ({ title, subtitle, pin, setPin, err, onEnter, demo }) => (
    <div style={{textAlign:"center",marginTop:60,padding:"0 20px"}}>
      <div style={{fontSize:44,marginBottom:14}}>🔐</div>
      <div style={{fontSize:18,fontWeight:"bold",color:"#f0c060",marginBottom:6}}>{title}</div>
      <div style={{fontSize:13,color:"#7a6040",marginBottom:6}}>{subtitle}</div>
      {demo && <div style={{fontSize:11,color:"#3a2e18",marginBottom:20}}>(Demo PIN: {demo})</div>}
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:10}}>
        <input type="password" value={pin} onChange={e=>{setPin(e.target.value);}}
          onKeyDown={e=>e.key==="Enter"&&onEnter()}
          placeholder="• • • •"
          style={{...s.input,width:130,textAlign:"center",letterSpacing:10,fontSize:20,padding:"10px"}} />
        <button onClick={onEnter} style={{...s.btnGold,borderRadius:10}}>Enter</button>
      </div>
      {err && <div style={{color:"#e53e3e",fontSize:13}}>Wrong PIN. Try again.</div>}
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0f0e0c",fontFamily:"Georgia,serif",color:"#f5f0e8",maxWidth:480,margin:"0 auto"}}>

      {/* Toast */}
      {toast && (
        <div style={{position:"fixed",top:76,left:"50%",transform:"translateX(-50%)",
          background:toast.color,color:"#fff",borderRadius:12,padding:"10px 22px",
          fontSize:13,fontWeight:"bold",zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,0.5)",
          whiteSpace:"nowrap"}}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1a0a00,#2d1200)",padding:"16px 16px 12px",
        borderBottom:"2px solid #c8860a",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{fontSize:20,fontWeight:"bold",color:"#f0c060",letterSpacing:1}}>🍽 {restName}</div>
            <div style={{fontSize:10,color:"#a07830",marginTop:1,letterSpacing:2,textTransform:"uppercase"}}>{restSub}</div>
          </div>
          <div style={{fontSize:11,color:"#7a6040"}}>
            {orders.filter(o=>o.status==="Pending").length > 0 &&
              <span style={{background:"#f59e0b22",color:"#f59e0b",border:"1px solid #f59e0b",
                borderRadius:10,padding:"2px 8px"}}>
                🔔 {orders.filter(o=>o.status==="Pending").length} pending
              </span>
            }
          </div>
        </div>
        <div style={{display:"flex",gap:6,overflowX:"auto"}}>
          {[["menu","Menu"],["cart",`Cart${cartCount>0?` (${cartCount})`:`}`}`],["kitchen","Kitchen"],["admin","Admin"]].map(([v,label])=>(
            <button key={v} onClick={()=>{
              setView(v);
              if(v==="kitchen"){setKitchenOpen(false);setKitchenPin("");}
              if(v==="admin"){setAdminOpen(false);setAdminPin("");}
            }} style={{
              background:view===v?"#c8860a":"transparent",
              border:"1px solid "+(view===v?"#c8860a":"#3a2e18"),
              borderRadius:20,padding:"5px 14px",
              color:view===v?"#000":"#c8860a",
              fontSize:12,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── MENU VIEW ── */}
      {view==="menu" && (
        <div>
          {/* Table picker */}
          <div style={{padding:"10px 16px",background:"#1a1208",borderBottom:"1px solid #2a1e08"}}>
            <div style={{fontSize:10,color:"#a07830",marginBottom:5,textTransform:"uppercase",letterSpacing:1}}>Ordering for</div>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
              {TABLE_NUMBERS.map(t=>(
                <button key={t} onClick={()=>setTable(t)} style={{
                  background:table===t?"#c8860a":"#2a1e08",
                  border:"1px solid "+(table===t?"#c8860a":"#3a2e18"),
                  borderRadius:16,padding:"4px 12px",
                  color:table===t?"#000":"#a07830",
                  fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div style={{display:"flex",overflowX:"auto",background:"#120d04",borderBottom:"1px solid #2a1e08",padding:"0 8px"}}>
            {allAvailCategories.map(cat=>(
              <button key={cat} onClick={()=>setActiveCategory(cat)} style={{
                background:"transparent",border:"none",
                borderBottom:activeCategory===cat?"2px solid #c8860a":"2px solid transparent",
                padding:"11px 14px",color:activeCategory===cat?"#f0c060":"#5a4020",
                fontSize:12,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",
              }}>{cat}</button>
            ))}
          </div>

          {/* Items */}
          <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
            {(menu[activeCategory]||[]).filter(i=>i.available).map(item=>{
              const ci = cart.find(c=>c.id===item.id);
              return (
                <div key={item.id} style={{...s.card,display:"flex",alignItems:"center",gap:12,
                  borderColor:ci?"#c8860a":"#2a1e08"}}>
                  <div style={{fontSize:34}}>{item.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"bold",fontSize:14,color:"#f5f0e8"}}>{item.name}</div>
                    <div style={{fontSize:11,color:"#6a5030",marginTop:2}}>{item.desc}</div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginTop:4}}>
                      <span style={{fontSize:14,color:"#f0c060",fontWeight:"bold"}}>₦{item.price.toLocaleString()}</span>
                      <span style={{fontSize:10,color:item.qty<=5?"#e53e3e":"#4a6020"}}>
                        {item.qty<=5?`⚠ ${item.qty} left`:`${item.qty} avail`}
                      </span>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {ci ? (
                      <>
                        <button onClick={()=>removeFromCart(item.id)} style={{width:28,height:28,borderRadius:"50%",
                          background:"#2a1e08",border:"1px solid #c8860a",color:"#c8860a",fontSize:16,cursor:"pointer"}}>−</button>
                        <span style={{color:"#f0c060",minWidth:18,textAlign:"center",fontWeight:"bold"}}>{ci.qty}</span>
                        <button onClick={()=>addToCart(item)} style={{width:28,height:28,borderRadius:"50%",
                          background:"#c8860a",border:"none",color:"#000",fontSize:16,cursor:"pointer"}}>+</button>
                      </>
                    ) : (
                      <button onClick={()=>addToCart(item)} style={{...s.btnGold,borderRadius:20,padding:"6px 16px",fontSize:12}}>Add</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CART VIEW ── */}
      {view==="cart" && (
        <div style={{padding:16}}>
          <div style={{fontSize:18,fontWeight:"bold",color:"#f0c060",marginBottom:2}}>Your Order</div>
          <div style={{fontSize:12,color:"#7a6040",marginBottom:16}}>{table}</div>
          {cart.length===0 ? (
            <div style={{textAlign:"center",color:"#3a2810",marginTop:60}}>
              <div style={{fontSize:44,marginBottom:10}}>🍽</div>
              Cart is empty. Add something tasty!
            </div>
          ) : (
            <>
              {cart.map(item=>(
                <div key={item.id} style={{...s.card,display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{fontSize:26}}>{item.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:"bold"}}>{item.name}</div>
                    <div style={{fontSize:11,color:"#f0c060"}}>₦{item.price.toLocaleString()} × {item.qty}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <button onClick={()=>removeFromCart(item.id)} style={{width:24,height:24,borderRadius:"50%",
                      background:"#2a1e08",border:"1px solid #c8860a",color:"#c8860a",fontSize:14,cursor:"pointer"}}>−</button>
                    <span style={{color:"#f0c060",minWidth:14,textAlign:"center"}}>{item.qty}</span>
                    <button onClick={()=>addToCart(item)} style={{width:24,height:24,borderRadius:"50%",
                      background:"#c8860a",border:"none",color:"#000",fontSize:14,cursor:"pointer"}}>+</button>
                  </div>
                  <div style={{fontSize:13,fontWeight:"bold",color:"#f0c060",minWidth:58,textAlign:"right"}}>
                    ₦{(item.price*item.qty).toLocaleString()}
                  </div>
                </div>
              ))}
              <div style={{borderTop:"1px solid #2a1e08",paddingTop:14,marginTop:4}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
                  <span style={{color:"#a07830",fontSize:15}}>Total</span>
                  <span style={{fontSize:20,fontWeight:"bold",color:"#f0c060"}}>₦{cartTotal.toLocaleString()}</span>
                </div>
                <button onClick={placeOrder} style={{...s.btnGold,width:"100%",padding:15,fontSize:15,borderRadius:14,
                  boxShadow:"0 4px 20px rgba(200,134,10,0.35)"}}>
                  📲 Place Order & Notify Kitchen via WhatsApp
                </button>
                <div style={{fontSize:11,color:"#4a6020",textAlign:"center",marginTop:8}}>
                  WhatsApp will open with order details pre-filled
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── KITCHEN VIEW ── */}
      {view==="kitchen" && (
        <div style={{padding:16}}>
          {!kitchenOpen ? (
            <PinScreen title="Kitchen Access" subtitle="Staff only"
              pin={kitchenPin} setPin={setKitchenPin} err={kitchenErr} onEnter={tryKitchen} demo="1234" />
          ) : (
            <>
              <div style={{fontSize:18,fontWeight:"bold",color:"#f0c060",marginBottom:2}}>Kitchen Dashboard</div>
              <div style={{fontSize:12,color:"#7a6040",marginBottom:16}}>{orders.length} orders today</div>
              {orders.length===0 ? (
                <div style={{textAlign:"center",color:"#3a2810",marginTop:60}}>
                  <div style={{fontSize:44,marginBottom:10}}>👨‍🍳</div>
                  No orders yet. Waiting...
                </div>
              ) : orders.map(order=>(
                <div key={order.id} style={{...s.card,marginBottom:12,borderLeft:`4px solid ${statusColor(order.status)}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div>
                      <span style={{fontWeight:"bold",fontSize:15,color:"#f0c060"}}>{order.table}</span>
                      <span style={{fontSize:11,color:"#4a3820",marginLeft:8}}>{order.time}</span>
                    </div>
                    <span style={{background:statusColor(order.status)+"22",color:statusColor(order.status),
                      border:`1px solid ${statusColor(order.status)}`,borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:"bold"}}>
                      {order.status}
                    </span>
                  </div>
                  {order.items.map(i=>(
                    <div key={i.id} style={{fontSize:12,color:"#a09070",marginBottom:2}}>
                      {i.emoji} {i.name} × {i.qty}
                    </div>
                  ))}
                  <div style={{fontSize:13,color:"#f0c060",fontWeight:"bold",margin:"8px 0 10px"}}>
                    ₦{order.total.toLocaleString()}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {["Pending","Preparing","Ready"].map(st=>(
                      <button key={st} onClick={()=>updateStatus(order.id,st)} style={{
                        flex:1,padding:"7px 0",
                        background:order.status===st?statusColor(st):"transparent",
                        border:`1px solid ${statusColor(st)}`,borderRadius:8,
                        color:order.status===st?"#000":statusColor(st),
                        fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",
                      }}>{st}</button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── ADMIN VIEW ── */}
      {view==="admin" && (
        <div style={{padding:16}}>
          {!adminOpen ? (
            <PinScreen title="Admin Panel" subtitle="Restaurant owner only"
              pin={adminPin} setPin={setAdminPin} err={adminErr} onEnter={tryAdmin} demo="9999" />
          ) : (
            <>
              <div style={{fontSize:18,fontWeight:"bold",color:"#f0c060",marginBottom:14}}>Admin Panel</div>

              {/* Admin tabs */}
              <div style={{display:"flex",gap:6,marginBottom:18,overflowX:"auto"}}>
                {[["items","📋 Menu Items"],["add","➕ Add Item"],["cats","🗂 Categories"],["settings","⚙ Settings"]].map(([t,label])=>(
                  <button key={t} onClick={()=>setAdminTab(t)} style={{
                    background:adminTab===t?"#c8860a":"#1a1208",
                    border:`1px solid ${adminTab===t?"#c8860a":"#2a1e08"}`,
                    borderRadius:20,padding:"6px 12px",
                    color:adminTab===t?"#000":"#a07830",
                    fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",
                  }}>{label}</button>
                ))}
              </div>

              {/* MENU ITEMS TAB */}
              {adminTab==="items" && (
                <div>
                  <div style={{fontSize:12,color:"#7a6040",marginBottom:12}}>
                    Tap price or quantity to edit inline. Toggle availability instantly.
                  </div>
                  {Object.keys(menu).map(cat=>(
                    <div key={cat} style={{marginBottom:20}}>
                      <div style={{fontSize:13,color:"#c8860a",fontWeight:"bold",marginBottom:8,
                        textTransform:"uppercase",letterSpacing:1}}>
                        {cat} <span style={{color:"#4a3820",fontWeight:"normal"}}>({menu[cat].length} items)</span>
                      </div>
                      {menu[cat].length===0 && (
                        <div style={{fontSize:12,color:"#3a2e18",padding:"8px 0"}}>No items yet</div>
                      )}
                      {menu[cat].map(item=>(
                        <div key={item.id} style={{...s.card,marginBottom:8,opacity:item.available?1:0.55,
                          borderColor:item.available?"#2a1e08":"#3a1010"}}>
                          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                            <div style={{fontSize:28,marginTop:2}}>{item.emoji}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:"bold",color:"#f5f0e8",marginBottom:6}}>{item.name}</div>
                              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                                <div>
                                  <div style={{fontSize:9,color:"#7a6040",marginBottom:2}}>PRICE (₦)</div>
                                  <input type="number" defaultValue={item.price}
                                    onBlur={e=>updateField(cat,item.id,"price",e.target.value)}
                                    style={{...s.input,width:90,padding:"5px 8px",fontSize:13}} />
                                </div>
                                <div>
                                  <div style={{fontSize:9,color:"#7a6040",marginBottom:2}}>QUANTITY</div>
                                  <input type="number" defaultValue={item.qty}
                                    onBlur={e=>updateField(cat,item.id,"qty",e.target.value)}
                                    style={{...s.input,width:80,padding:"5px 8px",fontSize:13,
                                      borderColor:item.qty<=5?"#e53e3e":"#3a2e18"}} />
                                </div>
                              </div>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                              <button onClick={()=>toggleAvail(cat,item.id)} style={{
                                background:item.available?"#0a2010":"#200a0a",
                                border:`1px solid ${item.available?"#22c55e":"#e53e3e"}`,
                                borderRadius:10,padding:"4px 10px",
                                color:item.available?"#22c55e":"#e53e3e",
                                fontSize:10,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",
                              }}>{item.available?"● On":"○ Off"}</button>
                              <button onClick={()=>deleteItem(cat,item.id)}
                                style={{...s.btnOutline("#7a3030"),fontSize:10,padding:"4px 10px"}}>🗑</button>
                            </div>
                          </div>
                          {item.qty<=5&&item.qty>0 && (
                            <div style={{fontSize:10,color:"#f59e0b",marginTop:6}}>
                              ⚠ Only {item.qty} portions left — restock soon
                            </div>
                          )}
                          {item.qty===0 && (
                            <div style={{fontSize:10,color:"#e53e3e",marginTop:6}}>
                              ✗ Out of stock — marked unavailable
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* ADD ITEM TAB */}
              {adminTab==="add" && (
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div>
                    <div style={{fontSize:10,color:"#7a6040",marginBottom:4}}>CATEGORY *</div>
                    <select value={newItem.category} onChange={e=>setNewItem(p=>({...p,category:e.target.value}))}
                      style={s.input}>
                      {Object.keys(menu).map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#7a6040",marginBottom:4}}>FOOD NAME *</div>
                    <input value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))}
                      placeholder="e.g. Ofada Rice & Sauce" style={s.input} />
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"#7a6040",marginBottom:4}}>PRICE (₦) *</div>
                      <input type="number" value={newItem.price} onChange={e=>setNewItem(p=>({...p,price:e.target.value}))}
                        placeholder="2500" style={s.input} />
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"#7a6040",marginBottom:4}}>QUANTITY</div>
                      <input type="number" value={newItem.qty} onChange={e=>setNewItem(p=>({...p,qty:e.target.value}))}
                        placeholder="20" style={s.input} />
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#7a6040",marginBottom:4}}>DESCRIPTION</div>
                    <input value={newItem.desc} onChange={e=>setNewItem(p=>({...p,desc:e.target.value}))}
                      placeholder="Short tasty description..." style={s.input} />
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#7a6040",marginBottom:6}}>CHOOSE EMOJI</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {EMOJIS.map(e=>(
                        <button key={e} onClick={()=>setNewItem(p=>({...p,emoji:e}))} style={{
                          fontSize:20,background:newItem.emoji===e?"#c8860a22":"transparent",
                          border:`1px solid ${newItem.emoji===e?"#c8860a":"#2a1e08"}`,
                          borderRadius:8,padding:4,cursor:"pointer",
                        }}>{e}</button>
                      ))}
                    </div>
                  </div>
                  {newItem.name&&newItem.price&&(
                    <div style={{...s.card}}>
                      <div style={{fontSize:10,color:"#7a6040",marginBottom:6}}>PREVIEW</div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{fontSize:28}}>{newItem.emoji}</div>
                        <div>
                          <div style={{fontSize:13,fontWeight:"bold"}}>{newItem.name}</div>
                          <div style={{fontSize:11,color:"#7a6040"}}>{newItem.desc}</div>
                          <div style={{fontSize:13,color:"#f0c060",fontWeight:"bold"}}>
                            ₦{parseInt(newItem.price||0).toLocaleString()} · {newItem.qty||0} portions
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button onClick={addItem} style={{...s.btnGold,padding:13,fontSize:14,borderRadius:12}}>
                    ➕ Add to Menu
                  </button>
                </div>
              )}

              {/* CATEGORIES TAB */}
              {adminTab==="cats" && (
                <div>
                  {Object.keys(menu).map(cat=>(
                    <div key={cat} style={{...s.card,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:"bold"}}>{cat}</div>
                        <div style={{fontSize:11,color:"#7a6040"}}>{menu[cat].length} items · {menu[cat].filter(i=>i.available).length} available</div>
                      </div>
                      <div style={{fontSize:18,color:"#3a2e18"}}>{menu[cat].filter(i=>i.available).length===0?"🔴":"🟢"}</div>
                    </div>
                  ))}
                  <div style={{marginTop:16}}>
                    <div style={{fontSize:11,color:"#7a6040",marginBottom:6}}>ADD NEW CATEGORY</div>
                    <div style={{display:"flex",gap:8}}>
                      <input value={newCat} onChange={e=>setNewCat(e.target.value)}
                        placeholder="e.g. Grills, Soups..." style={{...s.input,flex:1}} />
                      <button onClick={addCategory} style={{...s.btnGold,borderRadius:10,whiteSpace:"nowrap"}}>Add</button>
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {adminTab==="settings" && (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{...s.card,background:"#0a1a08",borderColor:"#1a3010"}}>
                    <div style={{fontSize:11,color:"#22c55e",marginBottom:2}}>📲 WhatsApp Notifications</div>
                    <div style={{fontSize:11,color:"#4a6030"}}>Every new order sends a WhatsApp message with full order details to your number.</div>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#7a6040",marginBottom:4}}>RESTAURANT NAME</div>
                    <input value={restName} onChange={e=>setRestName(e.target.value)} style={s.input} />
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#7a6040",marginBottom:4}}>LOCATION / TAGLINE</div>
                    <input value={restSub} onChange={e=>setRestSub(e.target.value)} style={s.input} />
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#7a6040",marginBottom:4}}>WHATSAPP NUMBER (with country code)</div>
                    <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)}
                      placeholder="2348012345678" style={s.input} />
                    <div style={{fontSize:10,color:"#4a6020",marginTop:4}}>
                      Format: 234 + number without leading 0 (e.g. 2348012345678)
                    </div>
                  </div>
                  <button onClick={()=>{setSettingsSaved(true);setTimeout(()=>setSettingsSaved(false),2500);}}
                    style={{...s.btnGold,padding:13,fontSize:14,borderRadius:12}}>
                    {settingsSaved?"✓ Saved!":"💾 Save Settings"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div style={{height:40}} />
    </div>
  );
}
