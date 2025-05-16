//At export statement of class component
showToast = false;
toastMessage = "";
toastStatus = 0; 

----------------------------------------
//At last
showToastMessage(message: string, status: number) {
  this.toastMessage = message;
  this.toastStatus = status; // 0 = already added (orange), 1 = successfully added (green)
  this.showToast = true;

  setTimeout(() => {
    // Add the hide class first to animate the toast sliding up
    const toastElement = this.elementRef.nativeElement.querySelector('.toast');
    if (toastElement) {
      toastElement.classList.add('hide');
    }

    // Then hide the toast after animation completes
    setTimeout(() => {
      this.showToast = false;
    }, 300); // Match this with the slideUp animation duration
  }, 3000);
}


-------------------------------------------------------------------
//Usage 
this.showToastMessage("Product Added to Wishlist", 1)   ---> Green Color Toast
this.showToastMessage("Already Added to Wishlist", 0)   ----> Orange Color Toast


