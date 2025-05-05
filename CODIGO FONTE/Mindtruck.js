document.addEventListener('DOMContentLoaded', () => {
  // Função do menu lateral responsivo
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId),
          bodypd = document.getElementById(bodyId),
          headerpd = document.getElementById(headerId);

    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        toggle.classList.toggle('bx-x');
        bodypd.classList.toggle('body-pd');
        headerpd.classList.toggle('body-pd');
      });
    }
  };

  showNavbar('header-toggle','nav-bar','body-pd','header');

  const linkColor = document.querySelectorAll('.nav_link');
  function colorLink() {
    if (linkColor) {
      linkColor.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  }
  linkColor.forEach(l => l.addEventListener('click', colorLink));

  // Dropdown do usuário
  const userPhoto = document.getElementById('userMenu');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  userPhoto.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
  });
  document.addEventListener('click', (event) => {
    if (!userPhoto.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove('show');
    }
  });

  // Função para criar botões reutilizáveis
  function createButton(iconClass, classes, onClick, text) {
    const button = document.createElement('button');
    button.classList.add(...classes);
    button.addEventListener('click', onClick);
    if (iconClass) {
      const icon = document.createElement('i');
      icon.classList.add('fa', iconClass);
      button.appendChild(icon);
    }
    if (text) {
      const buttonText = document.createElement('span');
      buttonText.textContent = text;
      button.appendChild(buttonText);
    }
    return button;
  }

  // Sistema de tarefas
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.querySelector('.tarefas');

  addTaskButton.addEventListener('click', () => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'Digite a tarefa';
    taskInput.classList.add('form-control', 'me-2');
    listItem.appendChild(taskInput);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('d-flex', 'gap-2');

    const saveButton = createButton('fa-save', ['btn', 'btn-success', 'btn-sm'], () => {
      if (taskInput.value.trim() !== '') {
        const taskText = document.createElement('span');
        taskText.textContent = taskInput.value;
        taskText.classList.add('me-2');
        listItem.insertBefore(taskText, taskInput);
        taskInput.remove();
        saveButton.remove();

        const editButton = createButton('fa-edit', ['btn', 'btn-warning', 'btn-sm'], () => {
          const newTaskInput = document.createElement('input');
          newTaskInput.type = 'text';
          newTaskInput.value = taskText.textContent;
          newTaskInput.classList.add('form-control', 'me-2');
          listItem.insertBefore(newTaskInput, taskText);
          taskText.remove();
          editButton.remove();

          const newSaveButton = createButton('fa-save', ['btn', 'btn-success', 'btn-sm'], () => {
            if (newTaskInput.value.trim() !== '') {
              taskText.textContent = newTaskInput.value;
              listItem.insertBefore(taskText, newTaskInput);
              newTaskInput.remove();
              newSaveButton.remove();
              buttonContainer.insertBefore(editButton, deleteButton);
            } else {
              alert('A tarefa não pode estar vazia!');
            }
          });

          buttonContainer.insertBefore(newSaveButton, deleteButton);
        });

        buttonContainer.insertBefore(editButton, deleteButton);

        const favoriteButton = createButton('fa-star', ['btn', 'btn-warning', 'btn-sm'], () => {
          const favoriteTasks = document.getElementById('favoriteTasks');
          favoriteTasks.appendChild(listItem);
          favoriteButton.remove();
        });
        buttonContainer.appendChild(favoriteButton);

        const completeButton = createButton('fa-check', ['btn', 'btn-primary', 'btn-sm'], () => {
          listItem.classList.toggle('tarefa-completa');

          if (listItem.classList.contains('tarefa-completa')) {
            document.getElementById('completeTasks').appendChild(listItem);
            completeButton.querySelector('i').classList.replace('fa-check', 'fa-undo');
            completeButton.classList.replace('btn-primary', 'btn-secondary');
            favoriteButton?.remove();
            editButton?.remove();
          } else {
            document.querySelector('.tarefas').appendChild(listItem);
            completeButton.querySelector('i').classList.replace('fa-undo', 'fa-check');
            completeButton.classList.replace('btn-secondary', 'btn-primary');
            if (!buttonContainer.contains(editButton)) {
              buttonContainer.insertBefore(editButton, completeButton);
            }
            if (!buttonContainer.contains(favoriteButton)) {
              buttonContainer.insertBefore(favoriteButton, completeButton);
            }
          }
        });
        buttonContainer.appendChild(completeButton);

      } else {
        alert('A tarefa não pode estar vazia!');
      }
    });

    const deleteButton = createButton('fa-trash', ['btn', 'btn-danger', 'btn-sm'], () => {
      listItem.remove();
    });

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(deleteButton);
    listItem.appendChild(buttonContainer);
    taskList.appendChild(listItem);
  });
});