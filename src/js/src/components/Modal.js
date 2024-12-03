import { LitElement, html, css } from 'lit';

export default class Modal extends LitElement {
    static properties = {
        open: { type: Boolean, reflect: true },
    };

    static styles = css`
        :host {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
            z-index: 1000; /* Ensure it appears above other content */
        }

        :host([open]) {
            display: flex;
        }

        .modal-content {
            display: flex;
            flex-direction: column;
            background-color: white;
            padding: 10px;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        }

        .btn-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: end;
        }

        .close-btn {
            background: #007bff;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    `;

    constructor() {
        super();
        this.open = false;
    }

    render() {
        return html`
            <div class="modal-content">
                <div class="btn-container">
                    <span class="close-btn" @click=${this.#closeModal}
                        >&times;</span
                    >
                </div>
                <slot></slot>
            </div>
        `;
    }

    #closeModal() {
        this.open = false;
    }
}

customElements.define('ac-modal', Modal);
