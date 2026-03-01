// Shared Notifications client
(function () {
    // Create modal UI
    function createModal() {
        if (document.getElementById('notificationsModal')) return;
        const modal = document.createElement('div');
        modal.id = 'notificationsModal';
        modal.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.45);display:none;align-items:center;justify-content:center;z-index:12000;padding:20px;';
        modal.innerHTML = `
      <div style="background:#fff;width:100%;max-width:720px;border-radius:10px;overflow:hidden;box-shadow:0 12px 40px rgba(15,23,42,0.3);">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #f0f0f3;">
          <div style="display:flex;gap:12px;align-items:center;"><i class="fas fa-bell" style="font-size:1.25em;color:var(--primary);"></i><strong style="font-size:1.05em;">Notifications</strong></div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button id="markAllReadBtn" class="btn-small btn-outline-secondary">Mark all as read</button>
            <button id="clearReadBtn" class="btn-small btn-outline-secondary">Clear read</button>
            <button id="closeNotificationsBtn" class="btn-small">Close</button>
          </div>
        </div>
        <div id="notificationsList" style="max-height:60vh;overflow:auto;padding:12px 8px;background:#fff;"></div>
        <div style="padding:12px 16px;border-top:1px solid #f0f0f3;display:flex;justify-content:flex-end;gap:12px;">
          <a href="notifications.html" id="viewAllNotifications" style="color:var(--primary);text-decoration:none;">View all</a>
        </div>
      </div>`;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('closeNotificationsBtn'); if (closeBtn) closeBtn.addEventListener('click', () => {
            const mm = document.getElementById('notificationsModal'); if (mm) mm.style.display = 'none';
        });
        const markAllBtn = document.getElementById('markAllReadBtn'); if (markAllBtn) markAllBtn.addEventListener('click', async () => {
            if (!window._latestNotifications || !window._latestNotifications.length) return;
            const unread = window._latestNotifications.filter(n => !n.read);
            const batch = firebase.firestore().batch();
            unread.forEach(n => batch.update(firebase.firestore().collection('notifications').doc(n.id), { read: true }));
            if (unread.length) await batch.commit();
        });
        const clearBtn = document.getElementById('clearReadBtn'); if (clearBtn) clearBtn.addEventListener('click', async () => {
            // Delete read notifications older than 30 days
            const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
            const snap = await firebase.firestore().collection('notifications')
                .where('read', '==', true)
                .where('timestamp', '<=', firebase.firestore.Timestamp.fromDate(cutoff))
                .get();
            const batch = firebase.firestore().batch();
            snap.forEach(d => batch.delete(d.ref));
            if (!snap.empty) await batch.commit();
            renderList(window._latestNotifications || []);
        });
    }

    function renderList(list) {
        const container = document.getElementById('notificationsList');
        if (!container) return;
        container.innerHTML = '';
        if (!list.length) return container.innerHTML = '<div style="color:var(--gray);padding:18px;text-align:center;">No notifications</div>';
        list.forEach(n => {
            const item = document.createElement('div');
            item.className = 'notification-modal-item';
            item.style.cssText = `padding:12px 14px;border-bottom:1px solid #f6f7fb;display:flex;gap:12px;align-items:flex-start;cursor:pointer;background:${n.read ? '#fff' : '#f5f7ff'}`;
            item.innerHTML = `
        <div style="width:40px;text-align:center;flex-shrink:0;"><i class="${n.icon || 'fas fa-bell'}" style="color:${n.read ? 'var(--gray)' : 'var(--primary)'};"></i></div>
        <div style="flex:1;">
          <div style="font-weight:600;color:${n.read ? 'var(--gray)' : 'var(--dark)'};">${escapeHtml(n.title || '')}</div>
          <div style="color:var(--gray);font-size:0.95em;margin-top:6px;">${escapeHtml(n.content || '')}</div>
          <div style="color:#888;font-size:0.85em;margin-top:6px;">${n.timestamp && n.timestamp.seconds ? new Date(n.timestamp.seconds * 1000).toLocaleString() : ''}</div>
        </div>`;
            item.addEventListener('click', async () => {
                try {
                    await firebase.firestore().collection('notifications').doc(n.id).update({ read: true });
                } catch (e) { console.error(e); }
                const modalEl = document.getElementById('notificationsModal'); if (modalEl) modalEl.style.display = 'none';
                // navigate
                if (n.link && n.link.startsWith('#')) {
                    const section = n.link.replace('#', '').replace('-section', '');
                    if (typeof window.switchSection === 'function') {
                        window.switchSection(section);
                    } else {
                        window.location.hash = n.link;
                    }
                } else if (n.link) {
                    window.location.href = n.link;
                }
            });
            container.appendChild(item);
        });
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (s) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]); });
    }

    // Attach bell behavior: show modal
    function setupBell() {
        document.body.addEventListener('click', function (e) {
            const bell = e.target.closest('.notification-bell');
            if (!bell) return;
            createModal();
            const modal = document.getElementById('notificationsModal');
            if (modal) {
                modal.style.display = 'flex';
                renderList(window._latestNotifications || []);
            }
        });
    }

    // Real-time listener and badge update
    function startRealtimeListener() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) return;
            // unsubscribe previous
            if (window._notifUnsub) window._notifUnsub();
            window._notifUnsub = firebase.firestore().collection('notifications')
                .where('recipientId', '==', user.uid)
                .orderBy('timestamp', 'desc')
                .limit(50)
                .onSnapshot(snap => {
                    const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                    window._latestNotifications = arr;
                    const unread = arr.filter(n => !n.read).length;
                    document.querySelectorAll('.notification-badge').forEach(el => {
                        el.textContent = unread > 0 ? unread : '';
                        el.style.display = unread > 0 ? 'inline-block' : 'none';
                    });
                    // If modal open, refresh list
                    const modalNow = document.getElementById('notificationsModal');
                    if (modalNow && modalNow.style.display === 'flex') {
                        renderList(arr);
                    }
                });
        });
    }

    // Public API
    async function createNotification({ recipientId, userRole, type, title, content, link = '', data = {}, icon = '' }) {
        try {
            // Basic validation to prevent undefined fields from reaching Firestore
            const payload = { recipientId, userRole, type, title, content, link, data, icon };
            // If a global validator exists (server-side tests), use it
            let valid = true, errors = [];
            if (window && window.Validators && typeof window.Validators.validateNotificationPayload === 'function') {
                const res = window.Validators.validateNotificationPayload(payload);
                valid = res.valid;
                errors = res.errors;
            } else {
                // Inline minimal validation
                if (!recipientId && recipientId !== 'broadcast') {
                    valid = false;
                    errors.push('recipientId is required (use "broadcast" for global notifications)');
                }
                const nestedUndefineds = (function check(o, path = '') {
                    if (o === undefined) return [path || 'value'];
                    if (o === null) return [];
                    if (Array.isArray(o)) return o.flatMap((v, i) => check(v, `${path}[${i}]`));
                    if (typeof o === 'object') return Object.keys(o).flatMap(k => check(o[k], path ? `${path}.${k}` : k));
                    return [];
                })(data, 'data');
                if (nestedUndefineds.length) { valid = false; errors.push(...nestedUndefineds.map(p => `data.${p} is undefined`)); }
            }

            if (!valid) {
                const errorMsg = 'Notification creation failed: ' + errors.join('; ');
                console.error(errorMsg);
                alert(errorMsg);
                throw new Error(errorMsg);
            }

            const cleaned = {
                recipientId,
                userRole: userRole || null,
                type: type || 'generic',
                title: title || '',
                content: content || '',
                link: link || '',
                data: data || {},
                read: false,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                icon: icon || ''
            };

            await firebase.firestore().collection('notifications').add(cleaned);
            return true;
        } catch (err) {
            console.error('createNotification error', err);
            return false;
        }
    }

    window.Notifications = { createNotification };
    // Init
    document.addEventListener('DOMContentLoaded', function () {
        setupBell();
        startRealtimeListener();
    });

})();
