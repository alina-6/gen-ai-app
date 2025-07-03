'use client'
import React, { useState } from "react";

type Task = {
    id: number;
    title: string;
    description?: string;
    status: "todo" | "inprogress" | "done";
};

const initialTasks: Task[] = [
    { id: 1, title: "Design UI", status: "todo" },
    { id: 2, title: "Set up backend", status: "inprogress" },
    { id: 3, title: "Write documentation", status: "done" },
];

const statusColumns = [
    { key: "todo", label: "To Do" },
    { key: "inprogress", label: "In Progress" },
    { key: "done", label: "Done" },
] as const;

export default function TaskBoardPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const addTask = () => {
        if (!newTaskTitle.trim()) return;
        setTasks([
            ...tasks,
            {
                id: Date.now(),
                title: newTaskTitle,
                status: "todo",
            },
        ]);
        setNewTaskTitle("");
    };

    const moveTask = (id: number, newStatus: Task["status"]) => {
        setTasks(tasks =>
            tasks.map(task =>
                task.id === id ? { ...task, status: newStatus } : task
            )
        );
    };

    return (
        <div style={{ padding: 32 }}>
            <h1>Task Board</h1>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="New task title"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                />
                <button onClick={addTask} style={{ marginLeft: 8 }}>
                    Add Task
                </button>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
                {statusColumns.map(col => (
                    <div key={col.key} style={{ flex: 1 }}>
                        <h2>{col.label}</h2>
                        <div style={{ minHeight: 100, background: "#f4f4f4", padding: 8, borderRadius: 4 }}>
                            {tasks
                                .filter(task => task.status === col.key)
                                .map(task => (
                                    <div
                                        key={task.id}
                                        style={{
                                            background: "#fff",
                                            marginBottom: 8,
                                            padding: 8,
                                            borderRadius: 4,
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        <div>{task.title}</div>
                                        <div style={{ marginTop: 4 }}>
                                            {statusColumns
                                                .filter(s => s.key !== task.status)
                                                .map(s => (
                                                    <button
                                                        key={s.key}
                                                        onClick={() => moveTask(task.id, s.key)}
                                                        style={{ marginRight: 4, fontSize: 12 }}
                                                    >
                                                        Move to {s.label}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}