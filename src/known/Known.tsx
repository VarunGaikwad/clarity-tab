import BackgroundImage from "../components/BackgroundImage";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";

export default function Known() {
  return (
    <BackgroundImage className="flex flex-col">
      <Header />
      <Main />
      <Footer />
    </BackgroundImage>
  );
}
