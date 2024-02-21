// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



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
            <p><em>TEXT</em></p>
			<p> ${block.title} 
            ${ block.content_html }
            <p><a href="${ block.source}">See the original ↗</a></p>
			</li>
			`
			channelBlocks.insertAdjacentHTML('beforeend', textItem)
		// …up to you!
	}

    // Links!
	if (block.class == 'Link') {
		let linkItem =
			`
			<li>
				<p><em>LINK</em></p>
				<h3>${ block.title }</h3>
                <picture>
                    <source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
                    <source media="(max-width: 640px)" srcset="${ block.image.large.url }">
                    <img src="${ block.image.original.url }">
                </picture>
				${ block.description_html }
				<p><a href="${ block.source.url }">See the original ↗</a></p>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

     // Uploaded (not linked) media…
    if (block.class == 'Attachment') {
        `
        <li>
            <p><em>Attachment</em></p>
            <h3>${block.title}</h3>
        </li>
        `
    let attachment = block.attachment.content_type // Save us some repetition

    // Uploaded PDFs!
    if (attachment.includes('pdf')) {
        let PDFItem =
    `
        <li class="block block--text">
            <p><em>PDF</em></p>
                <text>
                <h3>${block.title}</h3>
                <picture>
                    <source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
                    <source media="(max-width: 640px)" srcset="${ block.image.large.url }">
                    <img src="${ block.image.original.url }">
                </picture>
                <p><a href="${ block.source.url }">See the original↗</a></p>
                    
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



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
    let userAddress =
        `
        <address>
            <img src="${ user.avatar_image.display }">
            <h3>${ user.first_name }</h3>
            <p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
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

