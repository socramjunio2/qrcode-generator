import React, {
  useState,
  useEffect,
  ChangeEvent,
  DragEvent,
  // useCallback,
} from "react";
import { QRCodeSVG } from "qrcode.react";
// import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { saveAs } from "file-saver";
import logo from "../vmtech-logo.png";

type FormData = {
  name: string;
  job: string;
  cpf: string;
  phone: string;
  email: string;
  website: string;
  url: string;
  photoUrl: string;
  photoFile: File | null;
};

const QRCodeForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    job: "",
    cpf: "",
    phone: "",
    email: "",
    website: "",
    url: "",
    photoUrl: "",
    photoFile: null,
  });

  const [color, setColor] = useState<string>("#000000");
  const [qrType, setQrType] = useState<string>("vCard");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [vCardPrint, setVCardPrint] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  useEffect(() => {
    if (formData.photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(formData.photoFile);
    } else {
      setPhotoPreview("");
    }
  }, [formData.photoFile]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData({ ...formData, photoFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    generateQRCodeValue();
  };

  const handleColorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setColor(e.target.value);
  };

  const handleQrTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQrType(e.target.value);
  };

  const resizeAndConvertImage = (
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height *= maxWidth / width));
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width *= maxHeight / height));
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7).split(",")[1]);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const generateVCard = async (): Promise<string> => {
    let photoData = "";

    if (formData.photoFile) {
      photoData = await resizeAndConvertImage(formData.photoFile, 200, 200);
    } else if (formData.photoUrl) {
      const response = await fetch(formData.photoUrl);
      const blob = await response.blob();
      photoData = await resizeAndConvertImage(
        new File([blob], "photo.jpg"),
        200,
        200
      );
    }

    return `BEGIN:VCARD
VERSION:3.0
FN:${formData.name}
TITLE:${formData.job}
TEL;TYPE=voice,work,pref:${formData.phone}
EMAIL:${formData.email}
URL:${formData.website}
PHOTO;ENCODING=b;TYPE=JPEG:${photoData}
END:VCARD`;
  };

  const generateQRCodeValue = (): void => {
    if (qrType === "vCard") {
      generateVCard().then((vCard) => setVCardPrint(vCard));
    } else {
      setVCardPrint(formData.url);
    }
  };

  const generateQRCodeValueReturn = async (): Promise<string> => {
    if (qrType === "vCard") {
      return generateVCard();
    } else {
      return formData.url;
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFormData({ ...formData, photoFile: files[0] });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, photoFile: null });
    setPhotoPreview("");
  };

  const handleDownload = () => {
    const svgElement = document.getElementById("qrCode")?.querySelector("svg");

    console.log(svgElement);

    if (svgElement) {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);

      // Add namespace for SVG if it's not already present
      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns="http://www.w3.org/2000/svg"'
        );
      }
      if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
        );
      }

      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      saveAs(blob, "qrcode.svg");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <img src={logo} alt="VMTech Logo" className="w-32 h-32 mb-4" />

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Gerador de QR Code
        </h2>
        <form className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Tipo de QR Code:</span>
            <select
              value={qrType}
              onChange={handleQrTypeChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            >
              <option value="vCard">vCard</option>
              <option value="URL">URL</option>
            </select>
          </label>
          {qrType === "vCard" ? (
            <>
              {/* <div className="flex flex-col items-center mt-4">
                {photoPreview && !isDragOver ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md"
                    >
                      <AiOutlineDelete className="text-red-500" />
                    </button>
                    <label
                      htmlFor="fileInput"
                      className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md cursor-pointer"
                    >
                      <AiOutlineEdit className="text-blue-500" />
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="fileInput"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 ${
                      isDragOver ? "bg-gray-50" : ""
                    }`}
                  >
                    <span className="text-gray-700">
                      Clique ou arraste para enviar foto
                    </span>
                  </label>
                )}
                <input
                  type="file"
                  name="photoFile"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="fileInput"
                />
              </div> */}
              <input
                type="text"
                name="name"
                placeholder="Nome"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="job"
                placeholder="Cargo"
                value={formData.job}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="phone"
                placeholder="Telefone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="website"
                placeholder="Website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </>
          ) : (
            <input
              type="text"
              name="url"
              placeholder="URL"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          )}
          <label className="block">
            <span className="text-gray-700">Cor do QR Code:</span>
            <select
              value={color}
              onChange={handleColorChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            >
              <option value="#000000">Preto</option>
              <option value="#FF0000">Vermelho</option>
              <option value="#0000FF">Azul</option>
            </select>
          </label>
        </form>

        <div className="mt-6 flex justify-center" id="qrCode">
          <QRCodeSVG value={vCardPrint} fgColor={color} size={256} />
        </div>

        <div className="mt-6 flex justify-center">
          {(formData.name != "" || formData.url != "") && (
            <button
              onClick={handleDownload}
              className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Download QR Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeForm;
