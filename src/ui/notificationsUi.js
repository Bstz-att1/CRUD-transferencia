/**
 * Notifications Module (RF03)
 * Sistema de notificaciones y confirmaciones con SweetAlert2.
 */
import Swal from 'sweetalert2';

const baseToastOptions = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
};

function showToast(message, icon = 'info') {
    return Swal.fire({
        ...baseToastOptions,
        icon,
        title: message
    });
}

export function showSuccess(message) {
    return showToast(message, 'success');
}

export function showError(message) {
    return showToast(message, 'error');
}

export function showInfo(message) {
    return showToast(message, 'info');
}

export async function showConfirm({
    title = '¿Estás seguro?',
    text = 'Esta acción no se puede deshacer.',
    confirmButtonText = 'Sí, continuar',
    cancelButtonText = 'Cancelar',
    icon = 'warning'
} = {}) {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
        focusCancel: true,
        allowOutsideClick: false,
        customClass: {
            popup: 'swal-modern-popup',
            confirmButton: 'swal-modern-confirm',
            cancelButton: 'swal-modern-cancel'
        },
        buttonsStyling: true
    });

    return Boolean(result.isConfirmed);
}
