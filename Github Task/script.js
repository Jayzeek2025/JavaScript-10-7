const searchInput = document.getElementById("search");
const autocomplete = document.getElementById("autocomplete");
const repoList = document.getElementById("repo-list");

function debounce(fn, delay) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

async function searchRepositories(query) {
  if (!query) {
    autocomplete.innerHTML = "";
    return;
  }

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query}&per_page=5`
  );

  const data = await response.json();
  renderAutocomplete(data.items);
}

function renderAutocomplete(repos) {
  autocomplete.innerHTML = "";

  repos.forEach(repo => {
    const li = document.createElement("li");
    li.textContent = repo.full_name;

    li.addEventListener("click", () => {
      addRepository(repo);
      autocomplete.innerHTML = "";
      searchInput.value = "";
    });

    autocomplete.appendChild(li);
  });
}

function addRepository(repo) {
  const li = document.createElement("li");
  li.className = "repo-item";

  const info = document.createElement("div");
  info.className = "repo-info";

  info.innerHTML = `
    <span>Name: ${repo.name}</span>
    <span>Owner: ${repo.owner.login}</span>
    <span>Stars: ${repo.stargazers_count}</span>
  `;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => li.remove());

  li.appendChild(info);
  li.appendChild(deleteBtn);
  repoList.appendChild(li);
}

const debouncedSearch = debounce(searchRepositories, 500);

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();

  if (!value) {
    autocomplete.innerHTML = "";
    return;
  }

  debouncedSearch(value);
});
