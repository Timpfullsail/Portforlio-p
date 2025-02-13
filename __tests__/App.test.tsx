/** testing  branch for main push
 * 
 * @format
 */
  
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../newsrc/App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

