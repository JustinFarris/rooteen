document.addEventListener('DOMContentLoaded', function () {
    const deleteSelectedButton = document.getElementById('delete-selected');
    if (deleteSelectedButton) {
        deleteSelectedButton.addEventListener('click', function () {
            const checkboxes = document.querySelectorAll('.archived-task-checkbox:checked');
            const taskIds = Array.from(checkboxes).map(checkbox => checkbox.value);

            if (taskIds.length === 0) {
                alert('No tasks selected.');
                return;
            }

            if (!confirm('Are you sure you want to delete the selected tasks?')) {
                return;
            }

            const urlSearchParams = new URLSearchParams();
            taskIds.forEach(taskId => urlSearchParams.append('taskIds[]', taskId));
            window.location.href = `/delete-selected-tasks?${urlSearchParams.toString()}`;
        });
    }
});

document.getElementById('delete-selected-tasks-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('.archived-task-checkbox:checked');
    const taskIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    if (taskIds.length === 0) {
        alert('No tasks selected');
        return;
    }

    fetch('/delete-selected-tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskIds: taskIds })
    }).then(response => {
        if (response.status === 200) {
            taskIds.forEach(taskId => {
                const taskRow = document.getElementById(`task-row-${taskId}`);
                taskRow.remove();
            });
        }
    });
});

