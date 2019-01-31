const loader = document.querySelector('.loader');
const loaderWrapper = document.querySelector('.loader-background');

const fillLoader = (percentage) => {
  if (percentage < 100) {
    loader.style.width = `${percentage}%`;
  } else loaderWrapper.style.display = 'none';
};

export default fillLoader;
