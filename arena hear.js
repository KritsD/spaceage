// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'space-age-t7hodcanmxs' // The “slug” is just the end of the URL

const audio = new Audio("audio.mp3");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    audio.play();
  });
});

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

    if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type

		// Uploaded audio!
		if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li>
				<h3> ${block.title}</h3>
						<hr>
						<div class="audioblock">
							<audio controls src="${ block.attachment.url }"></audio>
						</div>
						<hr>
						<p class="created">${block.created_at} </p>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}

		// Uploaded videos!
		if (attachment.includes('video')) {
			console.log(block)
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li class="videoblock">
					<h3> ${block.title}</h3>
						<hr>
						<div>
							<video controls src="${ block.attachment.url }"></video>
						</div>
						<hr>
						<p class="created">${block.created_at} </p>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}
    }
    

        // Linked media…
        else if (block.class == 'Media') {
            let embed = block.embed.type

			// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<li>
					<h3> ${block.title}</h3>
					<hr>
					<div>
						${ block.embed.html }
					</div>
					<hr>
					<p class="created">${block.created_at} </p>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}


            // Linked audio!
            if (embed.includes('rich')) {
                let richItem =
                `
                    <li class="richitem">
						<h3> ${block.title}</h3>
						<hr>
							<div>${ block.embed.html }</div>
						<hr>
						<p class="created">${block.created_at} </p>
                    </li>
                    `
                    channelBlocks.insertAdjacentHTML('beforeend', richItem)
                }
        }            
}

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