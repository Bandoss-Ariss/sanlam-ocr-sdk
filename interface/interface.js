class SDKInterface {
    constructor() {}
  
    Generate() {
      // Create the container element
      const container = document.createElement("div");
      container.classList.add("container");
  
  
      // Create the button element
      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("btn", "btn-info", "btn-lg","invisible");
      button.setAttribute("data-toggle", "modal");
      button.setAttribute("data-target", "#myModal");
      button.setAttribute('id','trigger-scan');    
      button.textContent = "Ouvrir la popup";
  
      // Create the modal element
      const modal = document.createElement("div");
      modal.classList.add("modal", "fade");
      modal.setAttribute("id", "myModal");
      modal.setAttribute("role", "dialog");
  
      // Create the modal dialog element
      const modalDialog = document.createElement("div");
      modalDialog.classList.add("modal-dialog");
  
      // Create the modal content element
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
  
      // Create the modal header element
      const modalHeader = document.createElement("div");
      modalHeader.classList.add("modal-header");
  
      // Create the close button element
      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.classList.add("close");
      closeButton.setAttribute("data-dismiss", "modal");
      closeButton.innerHTML = "&times;";
  
      // Create the modal title element
      const modalTitle = document.createElement("h4");
      modalTitle.classList.add("modal-title");
      modalTitle.textContent = "Scan de documents";
  
      // Create the modal body element
      const modalBody = document.createElement("div");
      modalBody.classList.add("modal-body");
  
      // Create the iframe element
      const iframe = document.createElement("iframe");
      iframe.src = "http://localhost:5000/loadSanlamSDK";
      iframe.style.width = "100%";
      iframe.style.height = "600px";
  
      // Create the modal footer element
      const modalFooter = document.createElement("div");
      modalFooter.classList.add("modal-footer");
  
      // Create the close button for the footer
      const closeButtonFooter = document.createElement("button");
      closeButtonFooter.type = "button";
      closeButtonFooter.classList.add("btn", "btn-default");
      closeButtonFooter.setAttribute("data-dismiss", "modal");
      closeButtonFooter.textContent = "Fermer";
  
      // Append elements to their parent nodes
      modalHeader.appendChild(closeButton);
      modalHeader.appendChild(modalTitle);
      modalContent.appendChild(modalHeader);
      modalBody.appendChild(iframe);
      modalContent.appendChild(modalBody);
      modalFooter.appendChild(closeButtonFooter);
      modalContent.appendChild(modalFooter);
      modalDialog.appendChild(modalContent);
      modal.appendChild(modalDialog);
  
      container.appendChild(button);
      container.appendChild(modal);
  
      // Add the generated container to the document body
      document.body.appendChild(container);
    }
  }