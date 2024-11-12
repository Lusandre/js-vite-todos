import todoStore, { Filter } from "../store/todo.store";
import html from "./app.html?raw";
import { renderPending, renderTodos } from "./use-cases";

const ElementIds = {
  TodoList: ".todo-list",
  NewTodoInput: "#new-todo-input",
  ClearCompleted: ".clear-completed",
  TodoFilters: ".filtro",
  PendingCountLabel: "#pending-count",
};
/**
 *
 * @param {String} elementId
 */

export const App = (elementId) => {
  const displayTodos = () => {
    const todos = todoStore.getTodos(todoStore.getCurrentFilter());
    renderTodos(ElementIds.TodoList, todos);
    updatePendingCount();
  };

  const updatePendingCount = () => {
    renderPending(ElementIds.PendingCountLabel);
  };

  //Cuando la funcion App() se llama
  (() => {
    const app = document.createElement("div");
    app.innerHTML = html;
    document.querySelector(elementId).append(app);
    displayTodos();
  })();

  //Referencias HTML

  const newDescriptionInput = document.querySelector(ElementIds.NewTodoInput);
  const todoListUl = document.querySelector(ElementIds.TodoList);
  const clearCompleteButton = document.querySelector(ElementIds.ClearCompleted);
  const filterLIs = document.querySelectorAll(ElementIds.TodoFilters);

  //Listeners
  newDescriptionInput.addEventListener("keyup", (event) => {
    if (event.keyCode !== 13) return;
    if (event.target.value.trim().length === 0) return;
    todoStore.addTodo(event.target.value);
    displayTodos();
    event.target.value = "";
  });

  todoListUl.addEventListener("click", (event) => {
    const element = event.target.closest("[data-id]");
    todoStore.toggleTdo(element.getAttribute("data-id"));
    displayTodos();
  });

  todoListUl.addEventListener("click", (event) => {
    // if (!event.target.closest(".destroy")) return;
    const element = event.target.closest("[data-id]");
    const isDestroyElement = event.target.className === "destroy";
    if (!isDestroyElement || !element) return;
    todoStore.deleteTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  clearCompleteButton.addEventListener("click", () => {
    todoStore.deleteCompleted();
    displayTodos();
  });

  filterLIs.forEach((element) => {
    element.addEventListener("click", (element) => {
      filterLIs.forEach((el) => el.classList.remove("selected"));
      element.target.classList.add("selected");
      switch (element.target.text) {
        case "Todos":
          todoStore.setFilter(Filter.All);
          break;
        case "Pendientes":
          todoStore.setFilter(Filter.Pending);
          break;
        case "Completados":
          todoStore.setFilter(Filter.Completed);
          break;

        default:
          todoStore.setFilter(Filter.All);
          break;
      }
      displayTodos();
    });
  });
};
