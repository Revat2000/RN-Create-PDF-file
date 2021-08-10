import {
  createHTML,
  copyFromAssets,
  pickImage,
  processLocalImage,
} from "./helpers";
import { COLORS } from "./constants";

export const simpleHtml = (sholudRemovePageMargin = false) => () =>
  createHTML({
    content: `
    <h1>Hello, UppLabs! ${
      sholudRemovePageMargin ? "I'm without page margin!" : ""
    }</h1>
  `,
    sholudRemovePageMargin,
    styles: `
      body {
        background: ${COLORS.grey};
      }
    `,
  });

const sectionStyle = `
  section {
    background-color: ${COLORS.grey};
    height: 65vh;
    padding: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;

const createSections = (
  secondText = "Hello, Upplabs! I'm a broken section!"
) => `
<section>
  <h1>Hello, Upplabs! I'm a first section!</h1>
</section>
<section>
  <h1>${secondText}</h1>
</section>
`;

export const htmlWithBrokenSections = (
  shouldAvoidSectionBreaking = false
) => () => {
  const avoidBreakingStyle = `
    section {
      break-inside: avoid;
    }
  `;
  const secondSectionTitle = shouldAvoidSectionBreaking
    ? "Hello, Upplabs! I'm on the second page!"
    : undefined;
  return createHTML({
    content: createSections(secondSectionTitle),
    styles: `${sectionStyle} ${
      shouldAvoidSectionBreaking ? avoidBreakingStyle : ""
    }`,
  });
};

export const htmlWithImage = (fromAssets = true) => async () => {
  let src = !fromAssets
    ? "https://upplabs.com/wp-content/uploads/2019/11/Logo_upplabs@2x.png"
    : "";
  if (fromAssets) {
    try {
      const localSrc = await copyFromAssets(IMAGES.logo);
      src = await processLocalImage(localSrc);
    } catch (error) {
      console.log(error);
      src = "";
    }
  }
  return createHTML({
    content: `
    <h1>Hello, UppLabs! Look at ${
      !fromAssets ? "this remote image" : "image from applicaion assets"
    }!</h1>
    <div class="container">
      <a class="img-wrap" href="${src}">
        <img class="img-fluid" src="${src}" alt="Logo" />
      </a>
    </div>
  `,
    styles: `
    .img-wrap {
      display: block;
      text-align: center;
      cursor: pointer;
    }
  `,
  });
};

export const htmlWithPickedImage = (
  fromCamera = false,
  optimize = false
) => async () => {
  let src = "";
  try {
    const { uri } = (await pickImage(fromCamera)) || {};
    if (uri) {
      src = await processLocalImage(uri, optimize);
    }
  } catch (error) {
    console.log(error);
    src = "";
  }

  if (!src) {
    return null;
  }

  return createHTML({
    content: `
      <h1>Hello, UppLabs! Look at this photo ${
        fromCamera ? "from Camera" : "from Gallery"
      }${optimize ? " (optimized)" : ""}!</h1>
      <div class="container">
        <img class="img-fluid" src="${src}" alt="photo" />
      </div>
    `,
  });
};
