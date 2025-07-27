fetch('https://street-food-vendor-7kvx.onrender.com/api/vendors')
useEffect(() => {
  fetch("https://street-food-vendor-7kvx.onrender.com/api/vendors")
    .then(res => res.json())
    .then(data => setVendors(data))
    .catch(err => console.error("Error fetching vendors:", err));
}, []);