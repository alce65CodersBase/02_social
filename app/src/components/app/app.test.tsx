import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from './app';
import { Provider } from 'react-redux';
import { appStore } from '../../store/store';
describe('Given App', () => {
  describe('When', () => {
    test('Then it should ...', () => {
      render(
        <Provider store={appStore}>
          <App></App>
        </Provider>
      );
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });
});
