fetch('https://street-food-vendor-7kvx.onrender.com/api/vendors')
useEffect(() => {
fetch("https://street-food-vendor-7kvx.onrender.com/api/vendors")
.then(res => res.json())
.then(data => {
console.log("Vendors fetched:", data);
setVendors(data);
})
.catch(err => console.error("Fetch error:", err));
}, []);