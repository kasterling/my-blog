
document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const createPostBtn = document.getElementById('create-post-btn');
    const newPostTitleInput = document.getElementById('new-post-title');
    const createFromPerspectiveBtn = document.getElementById('create-from-perspective-btn');
    const perspectiveModal = document.getElementById('perspective-modal');
    const perspectiveTitleInput = document.getElementById('perspective-title');
    const perspectiveSelect = document.getElementById('perspective-select');
    const moodSelect = document.getElementById('mood-select');
    const createPerspectivePostBtn = document.getElementById('create-perspective-post-btn');
    const cancelPerspectiveBtn = document.getElementById('cancel-perspective-btn');
    const API_URL = 'http://localhost:3000/api';

    async function fetchPosts() {
        try {
            const response = await fetch(`${API_URL}/posts`);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const posts = await response.json();
            renderPosts(posts);
        } catch (error) {
            console.error('Error:', error);
            postList.innerHTML = '<li>Error loading posts. Is the server running?</li>';
        }
    }

    function renderPosts(posts) {
        postList.innerHTML = '';
        if (posts.length === 0) {
            postList.innerHTML = '<li>No posts found.</li>';
            return;
        }

        posts.forEach(post => {
            const item = document.createElement('li');
            item.className = 'post-item';
            item.dataset.slug = post.slug;

            item.innerHTML = `
                <span class="post-title">${post.title}</span>
                <div class="post-controls">
                    <span class="draft-label">Draft</span>
                    <label class="switch">
                        <input type="checkbox" class="draft-toggle" ${!post.isDraft ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            postList.appendChild(item);
        });
    }

    // Event delegation for toggles and deletes
    postList.addEventListener('click', async (e) => {
        const slug = e.target.closest('.post-item').dataset.slug;

        // Handle draft toggle
        if (e.target.classList.contains('draft-toggle')) {
            const isPublishing = !e.target.checked; // If unchecked, we're publishing
            
            if (isPublishing) {
                // Show publishing indicator
                const postItem = e.target.closest('.post-item');
                const originalTitle = postItem.querySelector('.post-title').textContent;
                postItem.querySelector('.post-title').textContent = `${originalTitle} (Publishing...)`;
                e.target.disabled = true;
            }
            
            try {
                const response = await fetch(`${API_URL}/posts/${slug}/toggle`, { method: 'POST' });
                if (!response.ok) throw new Error('Failed to toggle status');
                
                const result = await response.json();
                
                if (result.pushed) {
                    // Show success message for published posts
                    const postItem = e.target.closest('.post-item');
                    const originalTitle = postItem.querySelector('.post-title').textContent.replace(' (Publishing...)', '');
                    postItem.querySelector('.post-title').textContent = `${originalTitle} ✅ Published`;
                    
                    // Reset title after 3 seconds
                    setTimeout(() => {
                        postItem.querySelector('.post-title').textContent = originalTitle;
                    }, 3000);
                }
                
            } catch (error) {
                console.error('Error toggling draft status:', error);
                e.target.checked = !e.target.checked; // Revert on error
                
                // Reset title if publishing failed
                if (isPublishing) {
                    const postItem = e.target.closest('.post-item');
                    const originalTitle = postItem.querySelector('.post-title').textContent.replace(' (Publishing...)', '');
                    postItem.querySelector('.post-title').textContent = originalTitle;
                }
                
                alert('Error toggling post status. Please try again.');
            } finally {
                e.target.disabled = false;
            }
        }

        // Handle delete
        if (e.target.classList.contains('delete-btn')) {
            if (confirm(`Are you sure you want to delete "${slug}"?`)) {
                try {
                    const response = await fetch(`${API_URL}/posts/${slug}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete post');
                    fetchPosts(); // Refresh list
                } catch (error) {
                    console.error('Error deleting post:', error);
                }
            }
        }
    });

    // Handle create new post
    createPostBtn.addEventListener('click', async () => {
        const title = newPostTitleInput.value.trim();
        if (!title) {
            alert('Please enter a title.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/posts/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }

            newPostTitleInput.value = '';
            fetchPosts(); // Refresh list
        } catch (error) {
            console.error('Error creating post:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Handle create from perspective
    async function fetchPerspectives() {
        try {
            const response = await fetch(`${API_URL}/perspectives`);
            if (!response.ok) throw new Error('Failed to fetch perspectives');
            const perspectives = await response.json();
            
            perspectiveSelect.innerHTML = '<option value="">Choose a perspective...</option>';
            perspectives.forEach(perspective => {
                const option = document.createElement('option');
                option.value = perspective.item;
                option.textContent = `${perspective.section}: ${perspective.item}`;
                perspectiveSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching perspectives:', error);
            perspectiveSelect.innerHTML = '<option value="">Error loading perspectives</option>';
        }
    }

    createFromPerspectiveBtn.addEventListener('click', () => {
        perspectiveModal.style.display = 'block';
        fetchPerspectives();
    });

    cancelPerspectiveBtn.addEventListener('click', () => {
        perspectiveModal.style.display = 'none';
        perspectiveTitleInput.value = '';
        perspectiveSelect.value = '';
        moodSelect.value = 'exploratory';
    });

    createPerspectivePostBtn.addEventListener('click', async () => {
        const title = perspectiveTitleInput.value.trim();
        const perspective = perspectiveSelect.value;
        const mood = moodSelect.value;

        if (!title || !perspective) {
            alert('Please enter a title and select a perspective.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/posts/from-perspective`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, perspective, mood })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }

            perspectiveModal.style.display = 'none';
            perspectiveTitleInput.value = '';
            perspectiveSelect.value = '';
            moodSelect.value = 'exploratory';
            fetchPosts(); // Refresh list
        } catch (error) {
            console.error('Error creating perspective post:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Close modal when clicking outside
    perspectiveModal.addEventListener('click', (e) => {
        if (e.target === perspectiveModal) {
            cancelPerspectiveBtn.click();
        }
    });

    // Initial fetch
    fetchPosts();
});
