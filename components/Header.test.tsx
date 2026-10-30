import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
	it('renders correctly', () => {
		const { getByText } = render(<Header />);
		expect(getByText('Header Title')).toBeInTheDocument();
	});

	it('contains a logo', () => {
		const { getByAltText } = render(<Header />);
		expect(getByAltText('Logo')).toBeInTheDocument();
	});
});