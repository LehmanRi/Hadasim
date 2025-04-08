import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import '../Styles/ProductList.css'; 

 function ProductList({ products, selected, amounts, onToggle, onAmountChange }) {
  return (
    <List className="product-list">
    {products.map((product) => {
      const checked = selected.includes(product.id);
      const amount = amounts[product.id] || '';
  
      return (
        <ListItem key={product.id} className="product-item">
          <div className="product-item-header">
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked}
                onChange={() => onToggle(product.id)}
              />
            </ListItemIcon>
            <div className="product-info">
              <div>{product.name} — ₪{product.price_per_item}</div>
              <div className="product-min">Minimum: {product.min_quantity}</div>
            </div>
          </div>
  
          {checked && (
            <TextField
              label="Amount"
              type="number"
              size="small"
              value={amount}
              onChange={(e) => onAmountChange(product.id, e.target.value)}
              inputProps={{ min: product.min_quantity }}
              className="amount-input"
            />
          )}
        </ListItem>
      );
    })}
  </List>
  
  );
}
export default ProductList;
