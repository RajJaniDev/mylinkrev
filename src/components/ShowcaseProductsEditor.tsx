"use client";

import React, { useState } from "react";
import { Input } from "./ui/Input";

interface ProductItem {
  name: string;
  price: string;
  url: string;
  image: string; // base64 or URL
}

export function ShowcaseProductsEditor({ initialProducts }: { initialProducts?: ProductItem[] }) {
  const [products, setProducts] = useState<ProductItem[]>(
    initialProducts && initialProducts.length > 0 ? initialProducts : []
  );

  const handleAdd = () => {
    setProducts([...products, { name: "", price: "", url: "", image: "" }]);
  };

  const handleRemove = (index: number) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const handleChange = (index: number, key: keyof ProductItem, value: string) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [key]: value };
    setProducts(updated);
  };

  const handleImageUpload = (index: number, file: File | null) => {
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      alert("Product image must be smaller than 1MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(index, "image", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validProducts = products.filter(p => p.name.trim().length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input type="hidden" name="showcase_products" value={JSON.stringify(validProducts)} />

      {products.map((product, index) => (
        <div key={index} style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          background: "rgba(0,0,0,0.02)",
          padding: "1.25rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          position: "relative"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ margin: 0, fontWeight: 600 }}>Product #{index + 1}</h5>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={{
                background: "none", border: "none", color: "#ef4444", cursor: "pointer",
                fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Remove
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <Input
              label="Product Name"
              value={product.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              placeholder="e.g. Wireless Headphones"
              required
            />
            <Input
              label="Price"
              value={product.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
              placeholder="e.g. $99.00 or ₹4,999"
            />
          </div>

          <Input
            label="Product Buy Link (URL)"
            value={product.url}
            onChange={(e) => handleChange(index, "url", e.target.value)}
            placeholder="https://yourstore.com/products/..."
          />

          <div className="input-group">
            <label className="input-label">Product Image (Upload or URL)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                {product.image && (
                  <img
                    src={product.image}
                    alt="Preview"
                    style={{ width: "60px", height: "60px", borderRadius: "var(--radius-md)", objectFit: "cover", border: "1px solid var(--border)" }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files ? e.target.files[0] : null)}
                  className="input-field"
                  style={{ flex: "1 1 200px", minWidth: "0" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>OR Paste Image URL:</span>
                <input
                  type="url"
                  value={product.image.startsWith("data:") ? "" : product.image}
                  onChange={(e) => handleChange(index, "image", e.target.value)}
                  placeholder="https://..."
                  className="input-field"
                  style={{ flex: 1, padding: "0.4rem 0.75rem", fontSize: "0.875rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        style={{
          background: "rgba(59, 130, 246, 0.1)", color: "var(--primary)", border: "1px dashed var(--primary)",
          padding: "0.75rem", borderRadius: "var(--radius-md)", fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          transition: "background 0.2s", marginTop: "0.25rem"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)"}
        onMouseOut={(e) => e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Highlighted Product
      </button>
    </div>
  );
}
