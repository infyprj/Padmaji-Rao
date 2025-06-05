
**1. Introduction:**
"I worked on the shopping cart feature in the project. It lets users view and manage items they want to buy. I also added toast messages for user feedback and a login suggestion for guest users."

**2. Showing the Navbar:**
"I included the `<app-navbar>` component that stays on top for easy navigation."

**3. Login Suggestion:**
"If the user is not logged in, the app shows a message asking them to login before they can see their cart items."

**4. Loading Cart Items:**
"When the user is logged in, the cart loads their saved products by calling the cart service. It shows a loading spinner while fetching data."

**5. Displaying Cart Items:**
"Each cart item shows its image, name, price, and quantity. The user can increase or decrease the quantity using buttons."

**6. Updating Quantity:**
"When the user clicks plus or minus, the app checks if the new quantity is valid (not more than stock and not less than one), then sends an update request to the server. It updates the UI immediately and handles errors if the update fails."

**7. Removing Items:**
"The user can remove items from the cart. After confirmation, the item is removed from UI and server. If an error occurs, the item is added back."

**8. Moving Items to Wishlist:**
"The user can move items to the wishlist. If the item is already in wishlist, a warning toast shows; otherwise, it moves the item and removes it from cart with success toast."

**9. Cart Summary:**
"The cart shows subtotal, shipping cost (free if subtotal is above ₹50,000), tax (18%), and total amount. It updates dynamically based on the cart items."

**10. Checkout and Continue Shopping:**
"The user can go to checkout or continue shopping from the cart."

**11. Toast Messages:**
"I implemented toast messages to show success or warning feedback for actions like adding to wishlist or removing items. These messages appear briefly and then disappear with animation."

**12. Error Handling:**
"Errors from the server are caught and logged, and the user interface adjusts accordingly, like showing an error message or restoring previous state."

---

### What you can say about the code (high level):

* "I used Angular components, services, and observables to get data and update the cart."
* "I handled async calls with subscribe and updated the UI optimistically."
* "I applied conditional rendering with `*ngIf` to show loading states, login suggestion, empty cart, and cart contents."
* "I used template-driven event bindings for buttons to call component methods."
* "The component handles the whole cart page including interactions and calculations."

---
