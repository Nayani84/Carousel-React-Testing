import { render, fireEvent } from "@testing-library/react";
import Carousel from "./Carousel";
import TEST_IMAGES from "./_testCommon.js";
import photos from "./photos";

// Smoke test
it("renders without crashing", function () {
  render(<Carousel photos={photos} title="Test Carousel" />);
});

// Snapshot test
it("matches snapshot", function () {
  const { asFragment } = render(<Carousel photos={photos} title="Test Carousel" />);
  expect(asFragment()).toMatchSnapshot();
});

it("works when you click on the right arrow", function () {
  const { container } = render(
    <Carousel
      photos={TEST_IMAGES}
      title="images for testing"
    />
  );
  // expect the first image to show, but not the second
  expect(
    container.querySelector('img[alt="testing image 1"]')
  ).toBeInTheDocument();
  expect(
    container.querySelector('img[alt="testing image 2"]')
  ).not.toBeInTheDocument();

  // move forward in the carousel
  const rightArrow = container.querySelector(".bi-arrow-right-circle");
  fireEvent.click(rightArrow);

  // expect the second image to show, but not the first
  expect(
    container.querySelector('img[alt="testing image 1"]')
  ).not.toBeInTheDocument();
  expect(
    container.querySelector('img[alt="testing image 2"]')
  ).toBeInTheDocument();
});

it("works when you click on the left arrow", function () {
  const { getByTestId, queryByAltText } = render(
    <Carousel photos={photos} title="Test Carousel" />
  );

  // Move to the second image
  const rightArrow = getByTestId("right-arrow");
  fireEvent.click(rightArrow);

  // Move back to first image
  const leftArrow = getByTestId("left-arrow");
  fireEvent.click(leftArrow);

  expect(queryByAltText("Photo by Richard Pasquarella on Unsplash")).toBeInTheDocument();
  expect(queryByAltText("Photo by Pratik Patel on Unsplash")).not.toBeInTheDocument();
});

it("hides left arrow when in the first image", function () {
  const { getByTestId, queryByAltText, queryByTestId} = render(
    <Carousel photos={photos} title="Test Carousel" />
  );

  // confirm that first photo is being shown
  expect(queryByAltText("Photo by Richard Pasquarella on Unsplash")).toBeInTheDocument();

  // Check the left arrow is not visible on the first image
  const leftArrow = getByTestId("left-arrow");
  const rightArrow = getByTestId("right-arrow");
  expect(leftArrow).toHaveStyle("visibility: hidden");
  expect(rightArrow).toHaveStyle("visibility: visible");
  expect(queryByTestId("leftArrow")).not.toBeInTheDocument();
});

it("hides right arrow when in the last image", function () {
  const { getByTestId, queryByAltText, queryByTestId} = render(
    <Carousel photos={photos} title="Test Carousel" />
  );

  const leftArrow = getByTestId("left-arrow");
  const rightArrow = getByTestId("right-arrow");

  // Move to the last image
  fireEvent.click(rightArrow);
  fireEvent.click(rightArrow);

  // confirm that last photo is being shown
  expect(queryByAltText("Photo by Josh Post on Unsplash")).toBeInTheDocument();

  // Check that the right arrow is not visible on the last image
  expect(rightArrow).toHaveStyle("visibility: hidden");
  expect(leftArrow).toHaveStyle("visibility: visible");
  expect(queryByTestId("rightArrow")).not.toBeInTheDocument();
});