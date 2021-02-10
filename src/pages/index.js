import * as React from 'react';

// styles
const pageStyles = {
  color: '#232129',
  padding: '30px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

// markup
const IndexPage = () => {
  function handleClick(e) {
    fetch('/.netlify/functions/newsletter-signed-up')
      .then((response) => response.json())
      .then(console.log);
  }

  return (
    <main style={pageStyles}>
      <form onSubmit={handleClick}>
        <p>
          Stay tuned in as we discover more of this mysterious world. New
          products and stories every week.
        </p>
        <input />
        <button>sign me up</button>
      </form>
    </main>
  );
};

export default IndexPage;
