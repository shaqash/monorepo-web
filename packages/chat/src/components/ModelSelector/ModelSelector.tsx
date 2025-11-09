import './ModelSelector.css';
import type { FC } from 'preact/compat';
import { MODELS } from '../../config';

const getModelFromUrl = () => new URLSearchParams(window.location.search).get('model') ?? '';

export const ModelSelector: FC = () => {
    const selected = getModelFromUrl() || Object.keys(MODELS)[0];

    const handleChange = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        const val = target.value;
        const params = new URLSearchParams(window.location.search);
        params.set('model', val);
        // reload the page with the selected model in query param (simpler, deterministic)
        // this will cause the app to initialize with the chosen model via the existing URL parsing
        window.location.search = params.toString();
    };

    return (
        <div className="chat-topbar">
            <div className="model-selector">
                <label className="model-label" htmlFor="model-select">Model</label>
                <select id="model-select" defaultValue={selected} onChange={handleChange} className="model-select" aria-label="Model selector">
                    {Object.entries(MODELS).map(([key, info]) => (
                        <option value={key} key={key}>
                            {info.displayName}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
