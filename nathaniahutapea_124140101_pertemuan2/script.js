const STORAGE_KEY = 'ruang-fokus-dashboard-tasks';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true';
const PRIORITIES = {
  high: 'Penting',
  normal: 'Normal',
  low: 'Santai',
};
const WEATHER_CODES = {
  0: ['Cerah', '☀'],
  1: ['Cerah berawan', '🌤'],
  2: ['Berawan sebagian', '⛅'],
  3: ['Berawan', '☁'],
  45: ['Berkabut', '🌫'],
  48: ['Berkabut', '🌫'],
  51: ['Gerimis ringan', '🌦'],
  53: ['Gerimis', '🌦'],
  55: ['Gerimis lebat', '🌧'],
  61: ['Hujan ringan', '🌦'],
  63: ['Hujan', '🌧'],
  65: ['Hujan lebat', '🌧'],
  80: ['Hujan lokal', '🌦'],
  81: ['Hujan lokal', '🌧'],
  82: ['Hujan deras lokal', '🌧'],
  95: ['Badai petir', '⛈'],
};

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character]);

const localDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const dateAfterDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateString(date);
};

class TaskItem {
  constructor({
    id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title = '',
    course = 'Lainnya',
    dueDate = '',
    priority = 'normal',
    notes = '',
    completed = false,
    createdAt = new Date().toISOString(),
  } = {}) {
    this.id = String(id);
    this.title = String(title).trim();
    this.course = String(course).trim() || 'Lainnya';
    this.dueDate = String(dueDate);
    this.priority = Object.hasOwn(PRIORITIES, priority) ? priority : 'normal';
    this.notes = String(notes).trim();
    this.completed = Boolean(completed);
    this.createdAt = String(createdAt);
  }

  static from(data) {
    return new TaskItem(data);
  }

  static isValid(data) {
    return data
      && typeof data.id === 'string'
      && typeof data.title === 'string'
      && data.title.trim().length >= 3
      && typeof data.course === 'string'
      && /^\d{4}-\d{2}-\d{2}$/.test(data.dueDate)
      && typeof data.completed === 'boolean';
  }
}

class DashboardApp {
  constructor() {
    this.elements = {
      activeCount: document.querySelector('#active-count'),
      completionRate: document.querySelector('#completion-rate'),
      currentDate: document.querySelector('#current-date'),
      dialog: document.querySelector('#task-dialog'),
      emptyDescription: document.querySelector('#empty-description'),
      emptyState: document.querySelector('#empty-state'),
      emptyTitle: document.querySelector('#empty-title'),
      form: document.querySelector('#task-form'),
      formError: document.querySelector('#form-error'),
      list: document.querySelector('#task-list'),
      nextDeadline: document.querySelector('#next-deadline'),
      nextDeadlineCourse: document.querySelector('#next-deadline-course'),
      progressFill: document.querySelector('#progress-fill'),
      search: document.querySelector('#task-search'),
      sidebarCount: document.querySelector('#sidebar-task-count'),
      taskCount: document.querySelector('#total-count'),
      toast: document.querySelector('#toast'),
      weatherDescription: document.querySelector('#weather-description'),
      weatherIcon: document.querySelector('#weather-icon'),
      weatherTemperature: document.querySelector('#weather-temperature'),
    };
    this.filter = 'all';
    this.searchTerm = '';
    this.toastTimer = null;
    this.tasks = this.loadTasks();
    this.save();
    this.bindEvents();
    this.renderDate();
    this.render();
    this.loadWeather();
  }

  loadTasks() {
    try {
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(storedTasks)) {
        return storedTasks.filter(TaskItem.isValid).map(TaskItem.from);
      }
    } catch (error) {
      console.warn('Data tugas tidak dapat dibaca dari penyimpanan lokal:', error);
    }

    return [
      new TaskItem({
        title: 'Selesaikan dashboard personal',
        course: 'Pengembangan Aplikasi Web',
        dueDate: dateAfterDays(2),
        priority: 'high',
        notes: 'Rapikan fitur dan dokumentasi',
      }),
      new TaskItem({
        title: 'Latihan query JOIN',
        course: 'Basis Data',
        dueDate: dateAfterDays(1),
        priority: 'normal',
        notes: 'Coba INNER JOIN dan LEFT JOIN',
      }),
      new TaskItem({
        title: 'Review materi linked list',
        course: 'Struktur Data',
        dueDate: dateAfterDays(4),
        priority: 'low',
        notes: 'Baca ulang catatan minggu ini',
      }),
    ];
  }

  bindEvents() {
    this.handleSubmit = (event) => {
      event.preventDefault();
      this.saveTaskFromForm();
    };
    this.handleListClick = (event) => {
      const actionButton = event.target.closest('button[data-action]');
      if (!actionButton) return;
      const { action, taskId } = actionButton.dataset;
      if (action === 'edit') this.openDialog(taskId);
      if (action === 'delete') this.deleteTask(taskId);
    };
    this.handleToggle = (event) => {
      const checkbox = event.target.closest('input[data-toggle-id]');
      if (checkbox) this.toggleTask(checkbox.dataset.toggleId, checkbox.checked);
    };

    this.elements.form.addEventListener('submit', this.handleSubmit);
    this.elements.list.addEventListener('click', this.handleListClick);
    this.elements.list.addEventListener('change', this.handleToggle);
    this.elements.search.addEventListener('input', (event) => {
      this.searchTerm = event.target.value.trim().toLocaleLowerCase('id-ID');
      this.renderTasks();
    });
    document.querySelector('#open-task-dialog').addEventListener('click', () => this.openDialog());
    document.querySelector('#empty-add-button').addEventListener('click', () => this.openDialog());
    document.querySelector('#close-dialog').addEventListener('click', () => this.elements.dialog.close());
    document.querySelector('#cancel-dialog').addEventListener('click', () => this.elements.dialog.close());
    document.querySelectorAll('[data-filter]').forEach((button) => {
      button.addEventListener('click', () => this.setFilter(button.dataset.filter));
    });
    document.addEventListener('keydown', (event) => {
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        this.elements.search.focus();
      }
    });
  }

  renderDate() {
    this.elements.currentDate.textContent = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Data tugas tidak dapat disimpan:', error);
      this.showToast('Penyimpanan browser tidak tersedia.');
    }
  }

  render() {
    this.renderStats();
    this.renderTasks();
  }

  renderStats() {
    const completedTasks = this.tasks.filter(({ completed }) => completed);
    const activeTasks = this.tasks.filter(({ completed }) => !completed);
    let nextTask = null;
    for (const task of activeTasks) {
      if (!nextTask || task.dueDate < nextTask.dueDate) nextTask = task;
    }
    const percentage = this.tasks.length
      ? Math.round((completedTasks.length / this.tasks.length) * 100)
      : 0;

    this.elements.activeCount.textContent = String(activeTasks.length);
    this.elements.completionRate.textContent = `${percentage}%`;
    this.elements.progressFill.style.width = `${percentage}%`;

    if (nextTask) {
      this.elements.nextDeadline.textContent = this.formatDueDate(nextTask.dueDate);
      this.elements.nextDeadlineCourse.textContent = nextTask.course;
    } else {
      this.elements.nextDeadline.textContent = 'Belum ada';
      this.elements.nextDeadlineCourse.textContent = 'Tambahkan tugas pertamamu';
    }
  }

  getVisibleTasks() {
    const today = localDateString(new Date());
    return [...this.tasks]
      .filter((task) => {
        if (this.filter === 'today' && (task.completed || task.dueDate !== today)) return false;
        if (this.filter === 'upcoming' && (task.completed || task.dueDate <= today)) return false;
        if (this.filter === 'completed' && !task.completed) return false;
        const searchableText = `${task.title} ${task.course} ${task.notes}`.toLocaleLowerCase('id-ID');
        return searchableText.includes(this.searchTerm);
      })
      .sort((first, second) => Number(first.completed) - Number(second.completed)
        || first.dueDate.localeCompare(second.dueDate));
  }

  formatDueDate(value) {
    const today = localDateString(new Date());
    const tomorrow = dateAfterDays(1);
    if (value === today) return 'Hari ini';
    if (value === tomorrow) return 'Besok';
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(`${value}T12:00:00`));
  }

  renderTasks() {
    const visibleTasks = this.getVisibleTasks();
    this.elements.taskCount.textContent = `${this.tasks.length} tugas`;
    this.elements.sidebarCount.textContent = String(this.tasks.filter(({ completed }) => !completed).length);
    this.elements.list.innerHTML = visibleTasks.map((task) => this.renderTask(task)).join('');
    this.elements.emptyState.hidden = visibleTasks.length > 0;

    if (this.searchTerm) {
      this.elements.emptyTitle.textContent = 'Tugas tidak ditemukan';
      this.elements.emptyDescription.textContent = 'Coba kata kunci lain atau ubah filter pilihanmu.';
    } else if (this.filter === 'completed') {
      this.elements.emptyTitle.textContent = 'Belum ada yang selesai';
      this.elements.emptyDescription.textContent = 'Tandai tugas yang sudah beres untuk melihatnya di sini.';
    } else if (this.filter === 'today') {
      this.elements.emptyTitle.textContent = 'Hari ini masih lega';
      this.elements.emptyDescription.textContent = 'Tidak ada tugas dengan deadline hari ini.';
    } else {
      this.elements.emptyTitle.textContent = 'Belum ada tugas';
      this.elements.emptyDescription.textContent = 'Tambahkan tugas pertamamu dan mulai atur prioritas.';
    }
  }

  renderTask({ id, title, course, dueDate, priority, notes, completed }) {
    const today = localDateString(new Date());
    const dueClass = !completed && dueDate < today
      ? 'is-overdue'
      : dueDate === today ? 'is-today' : '';
    const dueLabel = !completed && dueDate < today
      ? `Lewat · ${this.formatDueDate(dueDate)}`
      : this.formatDueDate(dueDate);
    const priorityClass = `priority-${priority}`;
    const completeClass = completed ? 'is-complete' : '';
    const taskId = escapeHTML(id);

    return `
      <article class="task-card ${completeClass}" data-task-id="${taskId}">
        <input class="task-check" type="checkbox" data-toggle-id="${taskId}" aria-label="Tandai ${escapeHTML(title)} selesai" ${completed ? 'checked' : ''} />
        <div class="task-main">
          <h3 class="task-title">${escapeHTML(title)}</h3>
          <div class="task-meta">
            <span class="course-tag">${escapeHTML(course)}</span>
            <span class="priority-pill ${priorityClass}">${PRIORITIES[priority]}</span>
            ${notes ? `<span class="task-note">${escapeHTML(notes)}</span>` : ''}
          </div>
        </div>
        <time class="task-due ${dueClass}" datetime="${escapeHTML(dueDate)}">${escapeHTML(dueLabel)}</time>
        <div class="task-actions">
          <button class="task-action" type="button" data-action="edit" data-task-id="${taskId}" aria-label="Edit ${escapeHTML(title)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l4.2-.9L19 8.3 15.7 5 4.9 15.8z"/></svg></button>
          <button class="task-action delete" type="button" data-action="delete" data-task-id="${taskId}" aria-label="Hapus ${escapeHTML(title)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg></button>
        </div>
      </article>`;
  }

  setFilter(filter) {
    this.filter = filter;
    document.querySelectorAll('[data-filter]').forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    this.renderTasks();
  }

  openDialog(taskId = null) {
    this.elements.form.reset();
    this.elements.formError.textContent = '';
    this.elements.form.dataset.editId = taskId || '';
    const task = taskId ? this.tasks.find((item) => item.id === taskId) : null;
    document.querySelector('#dialog-kicker').textContent = task ? 'PERBARUI RENCANA' : 'TUGAS BARU';
    document.querySelector('#dialog-title').textContent = task ? 'Edit tugas' : 'Tambah tugas';
    document.querySelector('#save-task-button').textContent = task ? 'Simpan perubahan' : 'Simpan tugas';

    if (task) {
      this.elements.form.elements.title.value = task.title;
      this.elements.form.elements.course.value = task.course;
      this.elements.form.elements.dueDate.value = task.dueDate;
      this.elements.form.elements.priority.value = task.priority;
      this.elements.form.elements.notes.value = task.notes;
    } else {
      this.elements.form.elements.dueDate.value = dateAfterDays(1);
      this.elements.form.elements.priority.value = 'normal';
    }
    this.elements.dialog.showModal();
    this.elements.form.elements.title.focus();
  }

  saveTaskFromForm() {
    if (!this.elements.form.reportValidity()) return;
    const formData = new FormData(this.elements.form);
    const title = String(formData.get('title') || '').trim();
    if (title.length < 3) {
      this.elements.formError.textContent = 'Nama tugas harus terdiri dari minimal 3 karakter.';
      this.elements.form.elements.title.focus();
      return;
    }

    const editId = this.elements.form.dataset.editId;
    const existingTask = this.tasks.find(({ id }) => id === editId);
    const task = new TaskItem({
      ...(existingTask || {}),
      title,
      course: formData.get('course'),
      dueDate: formData.get('dueDate'),
      priority: formData.get('priority'),
      notes: formData.get('notes'),
    });

    this.tasks = existingTask
      ? this.tasks.map((item) => item.id === editId ? task : item)
      : [...this.tasks, task];
    this.save();
    this.render();
    this.elements.dialog.close();
    this.showToast(existingTask ? 'Tugas berhasil diperbarui.' : 'Tugas baru berhasil ditambahkan.');
  }

  toggleTask(taskId, completed) {
    this.tasks = this.tasks.map((task) => task.id === taskId
      ? new TaskItem({ ...task, completed })
      : task);
    this.save();
    this.render();
    this.showToast(completed ? 'Satu langkah selesai. Mantap!' : 'Tugas dikembalikan ke daftar aktif.');
  }

  deleteTask(taskId) {
    const taskToDelete = this.tasks.find(({ id }) => id === taskId);
    if (!taskToDelete) return;
    this.tasks = this.tasks.filter(({ id }) => id !== taskId);
    this.save();
    this.render();
    this.showToast('Tugas berhasil dihapus.');
  }

  showToast(message) {
    this.elements.toast.textContent = message;
    this.elements.toast.classList.add('is-visible');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.elements.toast.classList.remove('is-visible'), 2400);
  }

  async loadWeather() {
    try {
      const response = await fetch(WEATHER_URL, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { current_weather: currentWeather } = await response.json();
      if (!currentWeather) throw new Error('Data cuaca tidak tersedia.');
      const [description, icon] = WEATHER_CODES[currentWeather.weathercode] || ['Kondisi cuaca saat ini', '☁'];
      this.elements.weatherTemperature.textContent = `${Math.round(currentWeather.temperature)}°`;
      this.elements.weatherIcon.textContent = icon;
      this.elements.weatherDescription.textContent = description;
    } catch (error) {
      console.info('Cuaca ITERA tidak dapat dimuat:', error.message);
      this.elements.weatherTemperature.textContent = '--°';
      this.elements.weatherIcon.textContent = '☁';
      this.elements.weatherDescription.textContent = 'Cuaca belum bisa dimuat. Coba lagi nanti.';
    }
  }
}

const dashboard = new DashboardApp();
