import { useEffect, useMemo, useState } from 'react'
import { Search, ShoppingBag, User, Menu, X, Mountain, Plus, Minus, Trash2, ArrowRight, Package, ShieldCheck, Pencil, CheckCircle2, Heart } from 'lucide-react'

type Product = { id: number; name: string; category: string; price: number; oldPrice?: number; rating: number; image: string; tag?: string; description: string }
type UserAccount = { email: string; name: string; role: 'customer' | 'admin' }
type Cart = Record<number, number>
type Order = { id: string; total: number; status: string; date: string }

const initialProducts: Product[] = [
  { id: 1, name: 'Alpine Shell Jacket', category: 'Outerwear', price: 189, oldPrice: 240, rating: 4.9, tag: 'Best seller', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85', description: 'Weatherproof three-layer shell built for high alpine days and cold city nights.' },
  { id: 2, name: 'Summit Merino Crew', category: 'Layers', price: 98, rating: 4.8, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85', description: 'Ultra-soft merino wool layer with natural temperature regulation.' },
  { id: 3, name: 'Ridge Trail Pack', category: 'Equipment', price: 128, rating: 4.7, tag: 'New', image: 'https://images.unsplash.com/photo-1622260614929-5a1d1b6e7a9f?auto=format&fit=crop&w=800&q=85', description: 'A balanced 24L daypack with breathable back panel and hydration sleeve.' },
  { id: 4, name: 'Nightfall Camp Mug', category: 'Equipment', price: 32, rating: 4.6, image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=85', description: 'Double-wall insulated steel mug for sunrise coffee and fireside tea.' },
  { id: 5, name: 'Cairn Hiking Boots', category: 'Footwear', price: 164, oldPrice: 195, rating: 4.9, tag: 'Limited', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=85', description: 'Confident grip and all-day comfort from trailhead to summit.' },
  { id: 6, name: 'Basecamp Fleece', category: 'Layers', price: 84, rating: 4.8, image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85', description: 'Warm recycled fleece with a clean, versatile silhouette.' },
]

const money = (n: number) => `$${n.toFixed(2)}`

export function AppRoutes() {
  return <App />
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem('peak-products') || 'null') || initialProducts)
  const [cart, setCart] = useState<Cart>(() => JSON.parse(localStorage.getItem('peak-cart') || '{}'))
  const [account, setAccount] = useState<UserAccount | null>(() => JSON.parse(localStorage.getItem('peak-user') || 'null'))
  const [page, setPage] = useState<'home' | 'shop' | 'detail' | 'cart' | 'checkout' | 'orders' | 'admin'>('home')
  const [selected, setSelected] = useState<Product | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [authOpen, setAuthOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem('peak-orders') || '[]'))
  const [wishlist, setWishlist] = useState<number[]>(() => JSON.parse(localStorage.getItem('peak-wishlist') || '[]'))

  useEffect(() => { localStorage.setItem('peak-products', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('peak-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('peak-user', JSON.stringify(account)) }, [account])
  useEffect(() => { localStorage.setItem('peak-orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { localStorage.setItem('peak-wishlist', JSON.stringify(wishlist)) }, [wishlist])
  useEffect(() => { if (notice) { const t = setTimeout(() => setNotice(''), 2600); return () => clearTimeout(t) } }, [notice])

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]
  const filtered = useMemo(() => products.filter(p => (category === 'All' || p.category === category) && `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [products, category, query])
  const cartItems = products.filter(p => cart[p.id])
  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const subtotal = cartItems.reduce((sum, p) => sum + p.price * cart[p.id], 0)
  const add = (p: Product) => { setCart(c => ({ ...c, [p.id]: (c[p.id] || 0) + 1 })); setNotice(`${p.name} added to bag`) }
  const toggleWishlist = (p: Product) => { setWishlist(w => w.includes(p.id) ? w.filter(id => id !== p.id) : [...w, p.id]); setNotice(wishlist.includes(p.id) ? `${p.name} removed from wishlist` : `${p.name} saved to wishlist`) }
  const go = (p: Product) => { setSelected(p); setPage('detail'); window.scrollTo(0, 0) }
  const signOut = () => { setAccount(null); setPage('home'); setNotice('Signed out') }

  return <div className="app">
    <header className="nav"><button className="icon mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X /> : <Menu />}</button><button className="brand" onClick={() => setPage('home')}><Mountain size={25} /><span>PEAK<span> & </span>PROVISION</span></button>
      <nav className={menuOpen ? 'navlinks open' : 'navlinks'}><button onClick={() => { setPage('shop'); setMenuOpen(false) }}>Shop</button><button onClick={() => { setCategory('Equipment'); setPage('shop'); setMenuOpen(false) }}>Equipment</button><button onClick={() => { setCategory('Outerwear'); setPage('shop'); setMenuOpen(false) }}>Outerwear</button><button onClick={() => { setPage('orders'); setMenuOpen(false) }}>Track order</button></nav>
      <div className="navtools"><div className="search"><Search size={17} /><input value={query} onChange={e => { setQuery(e.target.value); setPage('shop') }} placeholder="Search the collection" /></div><button className="icon" onClick={() => account ? setPage(account.role === 'admin' ? 'admin' : 'orders') : setAuthOpen(true)} aria-label="Account"><User size={19} /></button><button className="bag icon" onClick={() => setPage('cart')} aria-label="Bag"><ShoppingBag size={20} />{count > 0 && <b>{count}</b>}</button></div>
    </header>
    <main>
      {page === 'home' && <Home onShop={() => setPage('shop')} onPick={go} products={products} add={add} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
      {page === 'shop' && <Shop products={filtered} categories={categories} category={category} setCategory={setCategory} onPick={go} add={add} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
      {page === 'detail' && selected && <Detail product={selected} add={add} onBack={() => setPage('shop')} />}
      {page === 'cart' && <CartView items={cartItems} cart={cart} setCart={setCart} subtotal={subtotal} onCheckout={() => account ? setPage('checkout') : setAuthOpen(true)} onShop={() => setPage('shop')} />}
      {page === 'checkout' && <Checkout total={subtotal + (subtotal >= 100 ? 0 : 12)} onDone={() => { const id = `PK-${Date.now().toString().slice(-6)}`; setOrders(o => [{ id, total: subtotal + (subtotal >= 100 ? 0 : 12), status: 'Order Placed', date: new Date().toLocaleDateString() }, ...o]); setCart({}); setPage('orders'); setNotice('Order placed — adventure awaits!') }} />}
      {page === 'orders' && <Orders account={account} orders={orders} onLogin={() => setAuthOpen(true)} />}
      {page === 'admin' && account?.role === 'admin' && <Admin products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} signOut={signOut} />}
    </main>
    <footer><div className="brand"><Mountain size={23} /><span>PEAK<span> & </span>PROVISION</span></div><p>Built for the wild. Designed for everywhere.</p><small>© 2025 Peak & Provision · Free shipping over $100</small></footer>
    {authOpen && <Auth onClose={() => setAuthOpen(false)} onLogin={(u) => { setAccount(u); setAuthOpen(false); setPage(u.role === 'admin' ? 'admin' : 'home'); setNotice(`Welcome back, ${u.name}`) }} />}
    {notice && <div className="toast"><CheckCircle2 size={18} />{notice}</div>}
  </div>
}

function Home({ onShop, onPick, products, add, wishlist, toggleWishlist }: { onShop: () => void; onPick: (p: Product) => void; products: Product[]; add: (p: Product) => void; wishlist: number[]; toggleWishlist: (p: Product) => void }) {
  return <><section className="hero"><div className="hero-copy"><span className="eyebrow">THE ALTITUDE COLLECTION · 2025</span><h1>Find your<br /><em>higher ground.</em></h1><p>Thoughtfully made equipment and everyday layers for the places that call you outside.</p><button className="primary" onClick={onShop}>Explore the collection <ArrowRight size={17} /></button></div><div className="hero-art"><div className="sun" /><div className="peak peak-back" /><div className="peak peak-front" /><span>“The mountains are<br />calling.”</span></div></section><section className="promise"><div><ShieldCheck /><strong>Built to last</strong><span>Purposeful materials, no shortcuts.</span></div><div><Package /><strong>Free shipping</strong><span>On orders over $100, always.</span></div><div><Mountain /><strong>Made for outside</strong><span>Tested where it matters most.</span></div></section><section className="featured"><div className="section-head"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Essential altitude</h2></div><button className="text-btn" onClick={onShop}>View all <ArrowRight size={15} /></button></div><div className="product-grid">{products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} onPick={onPick} add={() => add(p)} wished={wishlist.includes(p.id)} toggleWishlist={() => toggleWishlist(p)} />)}</div></section></>
}

function ProductCard({ product: p, onPick, add, wished, toggleWishlist }: { product: Product; onPick: (p: Product) => void; add: () => void; wished: boolean; toggleWishlist: () => void }) {
  return <article className="product-card"><button className="product-image" onClick={() => onPick(p)}><img src={p.image} alt={p.name} />{p.tag && <span className="tag">{p.tag}</span>}</button><div className="product-info"><div><small>{p.category}</small><h3>{p.name}</h3></div><div className="card-actions"><button aria-label={`Save ${p.name} to wishlist`} className={wished ? 'wish active' : 'wish'} onClick={e => { e.stopPropagation(); toggleWishlist() }}><Heart size={16} fill={wished ? 'currentColor' : 'none'} /></button><button aria-label={`Add ${p.name} to cart`} className="add-mini" onClick={e => { e.stopPropagation(); add() }}><Plus size={17} /></button></div></div><div className="price">{money(p.price)} {p.oldPrice && <del>{money(p.oldPrice)}</del>}<span>★ {p.rating}</span></div></article>
}

function Shop({ products, categories, category, setCategory, onPick, add, wishlist, toggleWishlist }: { products: Product[]; categories: string[]; category: string; setCategory: (x: string) => void; onPick: (p: Product) => void; add: (p: Product) => void; wishlist: number[]; toggleWishlist: (p: Product) => void }) {
  return <section className="shop page-pad"><div className="shop-title"><span className="eyebrow">THE COLLECTION</span><h1>Gear for the <em>journey.</em></h1><p>From first light to last call, carry what keeps you moving.</p></div><div className="filters">{categories.map(c => <button className={category === c ? 'active' : ''} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div><div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} onPick={onPick} add={() => add(p)} wished={wishlist.includes(p.id)} toggleWishlist={() => toggleWishlist(p)} />)}</div>{products.length === 0 && <div className="empty">No gear found. Try another search.</div>}</section>
}

function Detail({ product: p, add, onBack }: { product: Product; add: (p: Product) => void; onBack: () => void }) {
  return <section className="detail page-pad"><button className="back" onClick={onBack}>← Back to collection</button><div className="detail-grid"><img src={p.image} alt={p.name} /><div className="detail-copy"><small>{p.category}</small><h1>{p.name}</h1><div className="rating">★★★★★ <span>{p.rating} · 32 reviews</span></div><h2>{money(p.price)} {p.oldPrice && <del>{money(p.oldPrice)}</del>}</h2><p>{p.description}</p><div className="size-label">SELECT SIZE <span>Size guide</span></div><div className="sizes"><button>S</button><button className="selected">M</button><button>L</button><button>XL</button></div><button className="primary wide" onClick={() => add(p)}>Add to bag <ShoppingBag size={17} /></button><div className="detail-note">Free shipping and easy returns on every order.</div></div></div></section>
}

function CartView({ items, cart, setCart, subtotal, onCheckout, onShop }: { items: Product[]; cart: Cart; setCart: React.Dispatch<React.SetStateAction<Cart>>; subtotal: number; onCheckout: () => void; onShop: () => void }) {
  const update = (id: number, n: number) => setCart(c => { const next = { ...c }; if (n <= 0) delete next[id]; else next[id] = n; return next })
  return <section className="page-pad cart-page"><span className="eyebrow">YOUR SELECTION</span><h1>Your bag <span>({items.length})</span></h1>{!items.length ? <div className="empty"><ShoppingBag size={40} /><h2>Your bag is waiting.</h2><button className="primary" onClick={onShop}>Explore gear</button></div> : <div className="cart-grid"><div>{items.map(p => <div className="cart-row" key={p.id}><img src={p.image} alt="" /><div className="cart-name"><h3>{p.name}</h3><small>{p.category}</small><button className="remove" onClick={() => update(p.id, 0)}><Trash2 size={14} /> Remove</button></div><div className="quantity"><button onClick={() => update(p.id, cart[p.id] - 1)}><Minus size={14} /></button><span>{cart[p.id]}</span><button onClick={() => update(p.id, cart[p.id] + 1)}><Plus size={14} /></button></div><strong>{money(p.price * cart[p.id])}</strong></div>)}</div><aside className="summary"><h2>Order summary</h2><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Shipping</span><b>{subtotal >= 100 ? 'Free' : '$12.00'}</b></div><hr /><div className="total"><span>Total</span><b>{money(subtotal + (subtotal >= 100 ? 0 : 12))}</b></div><button className="primary wide" onClick={onCheckout}>Checkout <ArrowRight size={16} /></button></aside></div>}</section>
}

function Checkout({ total, onDone }: { total: number; onDone: () => void }) {
  return <section className="page-pad checkout"><span className="eyebrow">SECURE CHECKOUT</span><h1>Almost <em>there.</em></h1><div className="checkout-grid"><div className="form-card"><h2>Shipping details</h2><div className="form-row"><input placeholder="First name" /><input placeholder="Last name" /></div><input placeholder="Email address" /><input placeholder="Street address" /><div className="form-row"><input placeholder="City" /><input placeholder="Postal code" /></div><h2>Payment</h2><input placeholder="Card number  •••• •••• •••• ••••" /><div className="form-row"><input placeholder="MM / YY" /><input placeholder="CVC" /></div><button className="primary wide" onClick={onDone}>Place order · {money(total)} <ArrowRight size={16} /></button></div><div className="secure"><ShieldCheck size={25} /><strong>Safe & secure</strong><p>Your details are encrypted. This is a demo checkout — no payment is processed.</p></div></div></section>
}

function Orders({ account, orders, onLogin }: { account: UserAccount | null; orders: Order[]; onLogin: () => void }) {
  if (!account) return <section className="empty page-pad"><Package size={42} /><h2>Track your next adventure.</h2><p>Sign in to view your orders and delivery updates.</p><button className="primary" onClick={onLogin}>Sign in</button></section>
  return <section className="page-pad orders"><span className="eyebrow">WELCOME BACK, {account.name.toUpperCase()}</span><h1>Your orders</h1>{orders.length === 0 ? <div className="empty"><p>No orders yet — your next adventure starts here.</p></div> : orders.map(o => <div className="order-card" key={o.id}><Package /><div><strong>Order {o.id}</strong><p>{o.date} · {money(o.total)}</p><small className="tracking">Order Placed → Confirmed → Processing → Shipped → Delivered</small></div><span className="status">{o.status}</span><ArrowRight size={17} /></div>)}</section>
}

function Auth({ onClose, onLogin }: { onClose: () => void; onLogin: (u: UserAccount) => void }) {
  const [email, setEmail] = useState(''); const [name, setName] = useState(''); const [error, setError] = useState('')
  const submit = () => { if (email === 'admin@peakprovision.com' && name === 'peak2025') onLogin({ email, name: 'Admin', role: 'admin' }); else if (email && name) onLogin({ email, name, role: 'customer' }); else setError('Enter your email and password / name.') }
  return <div className="modal-bg" onClick={onClose}><div className="auth-modal" onClick={e => e.stopPropagation()}><button className="close" onClick={onClose}><X /></button><Mountain size={30} /><h2>Welcome to the wild.</h2><p>Sign in or create an account to continue.</p><input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" /><input value={name} onChange={e => setName(e.target.value)} placeholder="Password or your name" type={email.includes('admin') ? 'password' : 'text'} />{error && <small className="error">{error}</small>}<button className="primary wide" onClick={submit}>Continue <ArrowRight size={16} /></button><small className="demo">Demo admin: admin@peakprovision.com / peak2025</small></div></div>
}

function Admin({ products, setProducts, orders, setOrders, signOut }: { products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>>; orders: Order[]; setOrders: React.Dispatch<React.SetStateAction<Order[]>>; signOut: () => void }) {
  const [editing, setEditing] = useState<Product | null>(null)
  const save = () => { if (!editing) return; setProducts(ps => ps.some(p => p.id === editing.id) ? ps.map(p => p.id === editing.id ? editing : p) : [...ps, editing]); setEditing(null) }
  return <section className="page-pad admin"><div className="admin-head"><div><span className="eyebrow">COMMAND CENTER</span><h1>Store <em>dashboard.</em></h1></div><div className="admin-actions"><button className="text-btn" onClick={signOut}>Sign out</button><button className="primary" onClick={() => setEditing({ id: Date.now(), name: 'New product', category: 'Equipment', price: 0, rating: 5, image: initialProducts[0].image, description: 'Describe this product.' })}><Plus size={17} /> Add product</button></div></div><div className="stats"><div><small>Products</small><strong>{products.length}</strong></div><div><small>Orders</small><strong>{orders.length}</strong></div><div><small>Revenue</small><strong>{money(orders.reduce((a, o) => a + o.total, 0))}</strong></div><div><small>Low stock</small><strong>0</strong></div></div><h2>Product catalog</h2><div className="admin-list">{products.map(p => <div key={p.id}><img src={p.image} alt="" /><span><strong>{p.name}</strong><small>{p.category} · {money(p.price)}</small></span><button className="icon" aria-label={`Edit ${p.name}`} onClick={() => setEditing(p)}><Pencil size={16} /></button><button className="icon danger" aria-label={`Delete ${p.name}`} onClick={() => setProducts(ps => ps.filter(x => x.id !== p.id))}><Trash2 size={16} /></button></div>)}</div><h2 className="admin-section">Order management</h2><div className="admin-list">{orders.length === 0 ? <p className="empty">No orders to manage.</p> : orders.map(o => <div key={o.id}><span><strong>{o.id}</strong><small>{o.date} · {money(o.total)}</small></span><select value={o.status} onChange={e => setOrders(os => os.map(x => x.id === o.id ? { ...x, status: e.target.value } : x))}><option>Order Placed</option><option>Confirmed</option><option>Processing</option><option>Shipped</option><option>Delivered</option></select></div>)}</div>{editing && <div className="modal-bg"><div className="auth-modal edit"><button className="close" onClick={() => setEditing(null)}><X /></button><h2>Edit product</h2>{(['name', 'category', 'price', 'image'] as const).map(k => <input key={k} value={editing[k]} onChange={e => setEditing({ ...editing, [k]: k === 'price' ? Number(e.target.value) : e.target.value })} placeholder={k} />)}<textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /><button className="primary wide" onClick={save}>Save product</button></div></div>}</section>
}
