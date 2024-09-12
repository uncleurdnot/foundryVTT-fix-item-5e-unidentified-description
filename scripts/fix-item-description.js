Hooks.once('ready', () => {
  // Hook into the rendering of the Actor sheet to handle the item description preview
  Hooks.on('renderActorSheet5e', (app, html, data) => {
    // Find all item links in the sheet that would normally trigger a description preview
    html.find('.item .item-name').click(async (event) => {
      const itemId = $(event.currentTarget).closest('.item').data('item-id');
      const item = app.actor.items.get(itemId);
      
      // Check if the item is unidentified
      if (!item.system.identified) {
        // Prevent the default behavior that shows the identified description
        event.preventDefault();
        event.stopPropagation();

        // Locate the item-summary section
        const itemSummary = $(event.currentTarget).closest('.item').find('.item-summary');
        
        // Check if the item-summary section exists
        if (itemSummary.length) {
          // Access the unidentified description using the specified path
          const unidentifiedDescription = item.system.unidentified.description || "<p>No unidentified description available.</p>";
          
          // Replace the content with the unidentified description
          itemSummary.html(unidentifiedDescription);

          // Optionally expand the accordion section if it is collapsed
          const unidentifiedAccordion = $(event.currentTarget).closest('.item').find('.accordion:contains("Unidentified Description")');
          if (unidentifiedAccordion.length && unidentifiedAccordion.hasClass('collapsed')) {
            unidentifiedAccordion.removeClass('collapsed');
          }
        } else {
          // Handle cases where the item-summary section is not found
          console.warn('Item summary section not found for item:', itemId);
        }

        // Prevent the event from triggering other actions (like opening the item editor)
        return false;
      }
    });
  });
});
