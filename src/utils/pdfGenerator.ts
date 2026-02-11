import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateFirearmsGuardianPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const form = doc.getForm();

  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const margin = 40;
  let y = height - margin;

  const red = rgb(0.863, 0.149, 0.149);
  const black = rgb(0.12, 0.12, 0.12);
  const gray = rgb(0.42, 0.42, 0.42);
  const white = rgb(1, 1, 1);

  // Header
  page.drawRectangle({ x: 0, y: height - 50, width, height: 50, color: red });
  page.drawText("FIREARMS GUARDIAN", {
    x: margin, y: height - 32, size: 18, font: fontBold, color: white,
  });
  page.drawText("Application Form", {
    x: margin, y: height - 46, size: 10, font, color: rgb(1, 0.85, 0.85),
  });

  y = height - 72;

  const fieldH = 22;
  const labelGap = 2;
  const rowGap = 8;
  const col1X = margin;
  const col2X = margin + 255;
  const fullW = width - margin * 2;
  const halfW = 240;

  function drawSection(title: string) {
    page.drawRectangle({ x: margin, y: y - 16, width: fullW, height: 18, color: red });
    page.drawText(title.toUpperCase(), {
      x: margin + 8, y: y - 12, size: 9, font: fontBold, color: white,
    });
    y -= 34;
  }

  function drawLabel(text: string, x: number) {
    page.drawText(text, { x, y: y, size: 8, font: fontBold, color: gray });
  }

  function drawHalfFields(label1: string, name1: string, label2: string, name2: string) {
    drawLabel(label1, col1X);
    page.drawText(label2, { x: col2X, y, size: 8, font: fontBold, color: gray });
    y -= labelGap;
    const fieldY = y - fieldH;
    const tf1 = form.createTextField(name1);
    tf1.addToPage(page, { x: col1X, y: fieldY, width: halfW, height: fieldH,
      borderColor: rgb(0.78, 0.78, 0.78), backgroundColor: rgb(0.97, 0.97, 0.97),
    });
    tf1.setFontSize(10);
    const tf2 = form.createTextField(name2);
    tf2.addToPage(page, { x: col2X, y: fieldY, width: halfW, height: fieldH,
      borderColor: rgb(0.78, 0.78, 0.78), backgroundColor: rgb(0.97, 0.97, 0.97),
    });
    tf2.setFontSize(10);
    y = fieldY - rowGap;
  }

  function drawFullField(label: string, name: string) {
    drawLabel(label, col1X);
    y -= labelGap;
    const fieldY = y - fieldH;
    const tf = form.createTextField(name);
    tf.addToPage(page, { x: col1X, y: fieldY, width: fullW, height: fieldH,
      borderColor: rgb(0.78, 0.78, 0.78), backgroundColor: rgb(0.97, 0.97, 0.97),
    });
    tf.setFontSize(10);
    y = fieldY - rowGap;
  }

  // === PERSONAL DETAILS ===
  drawSection("Personal Details");

  drawHalfFields("Surname", "surname", "Name", "name");
  drawHalfFields("ID Number", "id_number", "Mobile Number", "mobile");
  drawFullField("Email Address", "email");
  drawFullField("Street Address", "street");
  drawHalfFields("Suburb", "suburb", "City", "city");

  drawLabel("Province", col1X);
  y -= labelGap;
  const provY = y - fieldH;
  const provDD = form.createDropdown("province");
  provDD.addOptions(["Please select", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"]);
  provDD.select("Please select");
  provDD.addToPage(page, { x: col1X, y: provY, width: halfW, height: fieldH,
    borderColor: rgb(0.78, 0.78, 0.78), backgroundColor: rgb(0.97, 0.97, 0.97),
  });
  y = provY - rowGap - 6;

  // === BANK ACCOUNT DETAILS ===
  drawSection("Bank Account Details");

  drawFullField("Account Holder", "account_holder");
  drawHalfFields("Bank Name", "bank_name", "Account Type", "account_type");
  drawFullField("Account Number", "account_number");
  y -= 6;

  // === CHOOSE YOUR COVER ===
  drawSection("Choose Your Cover");

  page.drawText("Please select one:", { x: col1X, y, size: 9, font, color: black });
  y -= 20;

  const cb1 = form.createCheckBox("option_1");
  cb1.addToPage(page, { x: col1X, y: y - 2, width: 14, height: 14 });
  page.drawText("Option 1: R135.00/month - Comprehensive Legal Protection", {
    x: col1X + 22, y: y + 1, size: 9, font, color: black,
  });
  y -= 22;

  const cb2 = form.createCheckBox("option_2");
  cb2.addToPage(page, { x: col1X, y: y - 2, width: 14, height: 14 });
  page.drawText("Option 2: R245.00/month - Enhanced Legal and Liability Cover", {
    x: col1X + 22, y: y + 1, size: 9, font, color: black,
  });
  y -= 30;

  drawLabel("Preferred Debit Date (1st - 28th)", col1X);
  y -= labelGap;
  const debitY = y - fieldH;
  const debitTf = form.createTextField("debit_date");
  debitTf.addToPage(page, { x: col1X, y: debitY, width: halfW, height: fieldH,
    borderColor: rgb(0.78, 0.78, 0.78), backgroundColor: rgb(0.97, 0.97, 0.97),
  });
  debitTf.setFontSize(10);
  y = debitY - rowGap - 6;

  // === DECLARATION ===
  drawSection("Declaration & Debit Order Authorisation");

  const declText = "I hereby request and authorise the Administrator, Firearms Guardian (Pty) Ltd, or its agents, to draw against my bank account as indicated each month. I apply for a Firearms Guardian policy in accordance with all applicable terms and conditions. I warrant that all information given in this application form is true and complete. I understand that the acceptance of my application is in the sole discretion of Firearms Guardian and GENRIC Insurance Company Limited.";

  const words = declText.split(" ");
  let line = "";
  const maxW = fullW;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, 7.5) > maxW && line) {
      page.drawText(line, { x: col1X, y, size: 7.5, font, color: gray });
      y -= 11;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    page.drawText(line, { x: col1X, y, size: 7.5, font, color: gray });
    y -= 18;
  }

  const cbAgree = form.createCheckBox("agree");
  cbAgree.addToPage(page, { x: col1X, y: y - 2, width: 14, height: 14 });
  page.drawText("I agree to the above declaration and debit order authorisation", {
    x: col1X + 22, y: y + 1, size: 9, font: fontBold, color: black,
  });
  y -= 30;

  // Signature and date
  drawHalfFields("Signature (Type full name)", "signature", "Date", "date");

  // Footer
  page.drawRectangle({ x: 0, y: 0, width, height: 28, color: rgb(0.96, 0.96, 0.96) });
  page.drawText(
    "Firearms Guardian (Pty) Ltd (FSP 47115) | Underwritten by GENRIC Insurance Company Limited (FSP 43638)",
    { x: margin, y: 11, size: 7, font, color: gray }
  );
  page.drawText("012 665 2500 | info@firearmsguardian.co.za | firearmsguardian.co.za", {
    x: margin, y: 3, size: 7, font, color: gray,
  });

  return doc.save();
}
