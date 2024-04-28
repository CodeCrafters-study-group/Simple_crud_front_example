const nameField = document.getElementById('name');
const searchFilter = document.getElementById('searchFilter');

const userId = document.getElementById('userId');
const updateName = document.getElementById('updateName');

const listUsersDiv = document.getElementById('listUsers');

const createUserForm = document.getElementById('createUserForm');
const updateForm = document.getElementById('updateForm');
const searchUserForm = document.getElementById('searchUserForm');

const updateModal = document.getElementById('updateModal')


createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createUser();
    await getUsers();
});

updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateUser();
    await getUsers();
});


searchUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await searchUser();

});

updateModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-bs-id')
    const name = button.getAttribute('data-bs-name')

    console.log(id, name);

    userId.value = id
    updateName.value = name
})

const generateUserItem = (users) => {
    listUsersDiv.innerHTML = '';
    listUsersDiv.innerHTML = '<h2>Users</h2>';
    // list all users
    users.forEach(user => {
        listUsersDiv.innerHTML += `<div class="userItem">
            <p class="userName">${user.name}</p>

            <div class="userActions">
                <button class="updateUserBtn" data-bs-toggle="modal" data-bs-target="#updateModal" data-bs-id="${user.id}" data-bs-name="${user.name}">
                    Edit
                </button>
                <button class="deleteUserBtn" onclick="deleteUser('${user.id}')">
                    Delete
                </button>
            </div>

        </div>`;
    });
}

const createUser = async () => {
    try {
        let name = nameField.value;

        if (!name) {
            alert("Name is required");
            return;
        }

        const response = await fetch('http://localhost:3000/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        });

        if (response.ok) {
            alert("User created");
        } else {
            alert("Error creating user");
        }
    } catch (error) {
        console.log(error);
        alert("Error creating user");
    }
}

const getUsers = async () => {
    try {
        const response = await fetch('http://localhost:3000/get-users');

        if (response.ok) {
            const users = await response.json();

            generateUserItem(users)

        } else {
            alert("Error getting users");
        }
    } catch (error) {
        console.log(error);
        alert("Error getting users");
    }
}

const deleteUser = async (id) => {

    let ok = confirm("Are you sure you want to delete this user?");
    if (!ok) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/delete-user/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("User deleted");
        } else {
            alert("Error deleting user");
        }

        await getUsers();

    } catch (error) {
        console.log(error);
        alert("Error deleting user");
    }
}

const updateUser = async () => {
    try {
        let id = userId.value;
        let name = updateName.value;

        if (!name) {
            alert("Name is required");
            return;
        }

        const response = await fetch(`http://localhost:3000/update-user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        });

        if (response.ok) {
            alert("User updated");
        } else {
            alert("Error updating user");
        }

        await getUsers();

    } catch (error) {
        console.log(error);
        alert("Error updating user");
    }
}

const searchUser = async () => {
    try {
        let name = searchFilter.value;

        const response = await fetch(`http://localhost:3000/filter-users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        });

        if (response.ok) {
            const users = await response.json();

            generateUserItem(users)

        } else {
            alert("Error searching user");
        }
    } catch (error) {
        console.log(error);
        alert("Error searching user");
    }
}

getUsers();
