document.getElementById('exercises').addEventListener('click', function () {
	window.location.href = '/exercises';
});

document.getElementById('statistics').addEventListener('click', function () {
	window.location.href = '/statistics';
});

document.getElementById('register').addEventListener('click', function () {
	window.location.href = '/register';
});

document.getElementById('home').addEventListener('click', function () {
	window.location.href = '/';
});

document.getElementById('login').addEventListener('click', function () {
	window.location.href = '/login';
});

document.getElementById('help').addEventListener('click', function () {
	window.location.href = '/help';
});

document.getElementById('profile').addEventListener('click', function () {
	window.location.href = '/profile';
});

document.addEventListener('DOMContentLoaded', function () {
	var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
		lineNumbers: true,
		mode: "python",
		smartIndent: true,
		indentUnit: 4,
		tabSize: 4,
		indentWithTabs: true,
		styleActiveLine: true
	});

	document.getElementById('console').style.display = 'none';
	document.getElementById('discussion-container').style.display = 'none';

	const pathArray = window.location.pathname.split('/');
	const exerciseId = pathArray[pathArray.length - 1];

	const savedCode = localStorage.getItem('savedCode-' + exerciseId);
	if (savedCode) {
		editor.setValue(savedCode);
	}

	fetch(`/api/exercises/${exerciseId}`)
		.then(response => response.json())
		.then(exercise => {
			document.getElementById('page-title').innerText = exercise.name;
			document.getElementById('problem-title').innerText = exercise.name;
			document.getElementById('problem-description').innerHTML = exercise.content;
			if (!editor.getValue()) {
				editor.setValue(exercise.solution_draft)
			}
			return fetch(`/api/exercises/${exerciseId}/get_like`);
		})
		.then(response => response.json())
		.then(data => {
			updateLikesDislikes(data.likes, data.dislikes);
		})
		.catch(error => console.error('Error:', error));

	function updateLikesDislikes(likes, dislikes) {
		const totalVotes = likes + dislikes;

		document.getElementById('likes-count').innerText = likes;
		document.getElementById('dislikes-count').innerText = dislikes;
	}


	document.getElementById('like-button').addEventListener('click', function () {
		sendVote(exerciseId, 1);
	});

	document.getElementById('dislike-button').addEventListener('click', function () {
		sendVote(exerciseId, -1);
	});

	function sendVote(exerciseId, voteType) {
		fetch(`/api/exercises/${exerciseId}/post_like`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ vote: voteType }),
		})
			.then(response => response.json())
			.then(data => {
				updateLikesDislikes(data.likes, data.dislikes);
			})
			.catch(error => console.error('Error:', error));
	}
	fetch(`/api/exercises/${exerciseId}/comments`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Failed to load comments')
			}
			return response.json();
		})
		.then(comments => {
			insertComments(comments);
		})
		.catch(error => {
			console.error('Error fetching comments:', error);
		});
	document.querySelector('.discussion-header').addEventListener('click', function () {
		var expanded = this.getAttribute('aria-expanded') === 'true';
		this.setAttribute('aria-expanded', !expanded);
		const discussionContainer = document.getElementById('discussion-container');
		discussionContainer.style.display = discussionContainer.style.display === 'none' ? 'block' : 'none';
	})
	document.getElementById('add-comment-btn').addEventListener('click', function () {
		const commentContent = document.getElementById('comment-text').value;

		const data = {
			commentContent: commentContent
		};

		fetch(`/api/exercises/${exerciseId}/add_comment`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network comment response not ok')
				}
				return response.json();
			})
			.then(comments => {
				insertComments(comments);
			})
			.catch(error => {
				console.error('Error fetching comments:', error);
			});

	})
	document.getElementById('run-btn').addEventListener('click', function () {
		const code = editor.getValue();
		localStorage.setItem('savedCode-' + exerciseId, code);

		const data = {
			exerciseId: exerciseId,
			code: code
		};

		fetch(`/api/exercises/${exerciseId}/run_code`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response not ok');
				}
				return response.json();
			})
			.then(data => {
				const output = data.output;
				document.getElementById('console-label').textContent = output;
				document.getElementById('console').style.display = 'block';
			})
			.catch(error => {
				console.error('Could not save the code:', error);
			});
	})
	document.getElementById('submit-btn').addEventListener('click', function () {
		const code = editor.getValue();
		localStorage.setItem('savedCode-' + exerciseId, code);

		const data = {
			exerciseId: exerciseId,
			code: code
		};

		fetch(`/api/exercises/${exerciseId}/submit_code`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response not ok');
				}
				return response.json();
			})
			.then(data => {
				let output = data.output;
				document.getElementById('console-label').textContent = output;
				if (data.isSuccessfulSubmition) {
					let roundedPercentage = Math.round(data.percentageOfWorseSolutions);
					document.getElementById('console-label').textContent = output
						+ `Your passed all the tests!\nYou solution was better than ${roundedPercentage}% of other people's submissions`;
				}
				document.getElementById('console').style.display = 'block';
			})
			.catch(error => {
				console.error('Could not save the code:', error);
			});
	})
	document.getElementById('console-btn').addEventListener('click', function () {
		const consoleElement = document.getElementById('console');
		consoleElement.style.display = consoleElement.style.display === 'none' ? 'block' : 'none';
	})
});

function insertComments(comments) {
	const listElement = document.getElementById('comment-list');
	listElement.innerHTML = '';

	comments.forEach(comment => {
		const listItem = document.createElement('li');
		listItem.classList.add('comment-item');
		listItem.innerHTML = `
					<div class="comment-content">${comment.comment_content}</div>
					<div class="comment-user">${comment.name}</div>
					<div class="comment-date">${new Date(comment.comment_date).toLocaleString()}</div>
				`;
		listElement.appendChild(listItem);
	})
};