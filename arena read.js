// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)

const audio = new Audio("audio.mp3");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    audio.play();
  });
});

// Okay, Are.na stuff!
let channelSlug = 'space-age-t7hodcanmxs' // The “slug” is just the end of the URL


// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
    // Target some elements in your HTML:
    let channelTitle = document.getElementById('channel-title')
    let channelDescription = document.getElementById('channel-description')
    let channelCount = document.getElementById('channel-count')
    let channelLink = document.getElementById('channel-link')

	
    // Then set their content/attributes to our data:
    channelTitle.innerHTML = data.title
    channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
    channelCount.innerHTML = data.length
    channelLink.href = `https://www.are.na/channel/${channelSlug}`
}


// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {

    // To start, a shared `ul` where we’ll insert all our blocks
    let channelBlocks = document.getElementById('channel-blocks')

    // Text!
	if (block.class == 'Text') {
		let textItem =
		`
			<li class="block block--text">
            <h3> ${block.title}</h3>
                <hr>
                <div>
                    <h3 class="size">${ block.content }</h3>
            </div>
                <hr>
                <h3>${block.description}</h3>
                <hr>
                <p class="created">${block.created_at} </p>
			</li>
			`
			channelBlocks.insertAdjacentHTML('beforeend', textItem)
		// …up to you!
	}

    // Links!
	if (block.class == 'Link') {
    if (block.description.length > 0) {
		let linkItem =
			`
			<li>
                <h3> ${block.title}</h3>
                <hr>
                <div>
                    <source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
                    <source media="(max-width: 640px)" srcset="${ block.image.large.url }">
                    <img src="${ block.image.original.url }">
                </div>
                <hr>
                <h3><a href="${ block.source.url }">See the original ↗</a></h3>
                <hr>
                <p class="created">${block.created_at} </p>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
    }
	else if (block.class == 'Link') {
		let linkItem =
			`
			<li>
                <h3> ${block.title}</h3>
                <hr>
                <div>
                    <source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
                    <source media="(max-width: 640px)" srcset="${ block.image.large.url }">
                    <img src="${ block.image.original.url }">
                </div>
                <hr>
                <h3><a href="${ block.source.url }">See the original ↗</a></h3>
                <hr>
                <p class="created">${block.created_at} </p>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}}

     // Uploaded (not linked) media…
    if (block.class == 'Attachment') {
        `
        <li>
            <h3>${block.title}</h3>
        </li>
        `
    let attachment = block.attachment.content_type // Save us some repetition

    // Uploaded PDFs!
    if (attachment.includes('pdf')) {
        let PDFItem =
    `
        <li class="block block--text">
                <text>
                <h3> ${block.title}</h3>
                <hr>
                <div>
                    <source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
                    <source media="(max-width: 640px)" srcset="${ block.image.large.url }">
                    <img src="${ block.image.original.url }">
                </div>
                <hr>
                <h3><a href="${ block.source.url }">See the original ↗</a></h3>
                <hr>
                <p class="created">${block.created_at} </p>
        </li>
    `
    channelBlocks.insertAdjacentHTML('beforeend', PDFItem)
        }
    }
}
    // // Images!
    // if (block.title.includes('space-furniture')) {
    //     let imageItem =
    //     `
    //     <li class="block block--image">
    //         <p><em>Image</em></p>
    //         <figure>
    //             <img src="${block.image.square.url}" alt=${block.title}">
    //         </figure>
    //         <h3>${block.title}</h3>
    //     </li>
    //     `
    //     channelBlocks.insertAdjacentHTML('beforeend', imageItem)
    //     // …up to you!
    // }

    
    // // Linked media…
    // if (block.class == 'Media') {
    //     let embed = block.embed.type


	// 	if (block.title.includes('space-mission')) {
	// 		let linkedVideoItem =
    //             `
    //             <li>
    //                 <p><em>Video</em></p>
    //                 ${ block.embed.html }
    //                 <h3>${block.title}</h3>
    //             </li>
    //             `
    //         channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)

	// 	}

    //     // Linked audio!
    //     if (embed.includes('rich')) {
    //         `
    //             <li>
    //                 <p><em>Video</em></p>
    //                 ${ block.embed.html }
    //                 <h3>${block.title}</h3>
    //             </li>
    //             `
    //         // …up to you!
	// 	}
	// }

    let highlightClass = 'highlight' 
    let imageBlock = document.querySelector('.headerandmain') 
    let switchButton = document.querySelector('#zoomimages')

    switchButton.onclick = () => { // Attach the event.
        imageBlock.classList.toggle(highlightClass) // Toggle the class!
    };


// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
    let userAddress =
        `
        <address>
            <h3 class="padding"><a class="address" href="https://are.na/${ user.slug }"> ${user.first_name}↗</a></h3>
        </address>
        `
    container.insertAdjacentHTML('beforeend', userAddress)
}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
    .then((response) => response.json()) // Return it as JSON data
    .then((data) => { // Do stuff with the data
        console.log(data) // Always good to check your response!
        placeChannelInfo(data) // Pass the data to the first function

        // Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
        data.contents.reverse().forEach((block) => {
            // console.log(block) // The data for a single block
            renderBlock(block) // Pass the single block data to the render function
        })

        // Also display the owner and collaborators:
        let channelUsers = document.getElementById('channel-users') // Show them together
        data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
        renderUser(data.user, channelUsers)
    })

