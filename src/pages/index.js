import * as React from 'react';

// styles
const pageStyles = {
  color: '#232129',
  padding: '30px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

// markup
const IndexPage = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(e, 'datadofr');
    console.log(e.target.value, 'value');
    console.log('click 1344');
    try {
      const res = await fetch(
        `/.netlify/functions/newsletter-signed-up?email=${'test123'}&locale=${'by'}`,
      ).then((res) => res.json());
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main style={pageStyles}>
      <form onSubmit={handleSubmit}>
        <p>
          Stay tuned in as we discover more of this mysterious world. New
          products and stories every week.
        </p>
        <input type="email" name="email" />
        <button type="submit">sign me up</button>
      </form>
    </main>
  );
};

export default IndexPage;
