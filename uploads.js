const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};

const element = (tag, classes = [], content) => {
  const node = document.createElement(tag);
  if (classes.length) {
    node.classList.add(...classes);
  }

  if (content) {
    node.textContent = content;
  }

  return node;
};

export const upload = (selector, options = {}) => {
  const noop = () => {};

  let files = [];
  const onUpload = options.onUpload ?? noop;
  const input = document.querySelector(selector);

  const prev = element('div', ['prev']);
  const open = element('button', ['card_btn'], 'Открыть');
  const uploadFile = element('button', ['card_btn', 'primary'], 'Загрузить');
  uploadFile.style.display = 'none';

  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(', '));
  }

  input.insertAdjacentElement('afterend', prev);
  input.insertAdjacentElement('afterend', uploadFile);
  input.insertAdjacentElement('afterend', open);

  const triggerInput = () => {
    input.click();
  };

  const changeHandler = (e) => {
    if (!e.target.files.length) {
      return;
    }

    files = Array.from(e.target.files);
    prev.innerHTML = '';
    uploadFile.style.display = 'inline';

    files.forEach((item) => {
      if (!item.type.match('image')) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const div = document.createElement('div');
        div.classList.add('prev_img');
        const src = e.target.result;
        div.innerHTML = `
          <div class="prev_remove" data-name="${item.name}">&times;</div>
          <img src="${src}" />
          <div class="prev_info">
            <span>${item.name}</span>
            <span>${bytesToSize(item.size)}</span>
          </div>
        `;
        prev.append(div);
      };
      reader.readAsDataURL(item);
    });
  };

  const removeHeadler = (e) => {
    if (!e.target.dataset.name) {
      return;
    }

    const { name } = e.target.dataset;
    files = files.filter((file) => file.name != name);
    if (!files.length) {
      uploadFile.style.display = 'none';
    }
    const block = document
      .querySelector(`[data-name="${name}"]`)
      .closest('.prev_img');
    block.classList.add('removing');
    setTimeout(() => {
      block.remove();
    }, 300);
  };

  const clearPrev = (elem) => {
    elem.style.bottom = '4px';
    elem.innerHTML = '<div class="prev_info-progress"></div>';
  };

  const uploadHeandler = () => {
    prev.querySelectorAll('.prev_remove').forEach((item) => {
      item.remove();
    });
    const prevInfo = prev.querySelectorAll('.prev_info');
    prevInfo.forEach(clearPrev);
    onUpload(files, prevInfo);
  };
  open.addEventListener('click', triggerInput);
  input.addEventListener('change', changeHandler);
  prev.addEventListener('click', removeHeadler);
  uploadFile.addEventListener('click', uploadHeandler);
};
