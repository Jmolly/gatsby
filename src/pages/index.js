import * as React from 'react';

// styles
const pageStyles = {
  color: '#232129',
  padding: '30px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

// markup
const IndexPage = () => {
  return (
    <main style={pageStyles}>
      <p>
        Stay tuned in as we discover more of this mysterious world. New products
        and stories every week.
      </p>
      <input />
      <button>sign me up</button>
    </main>
  );
};

export default IndexPage;
