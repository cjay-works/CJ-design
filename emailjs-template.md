# CJ Design EmailJS Template

The EmailJS dashboard controls the received email appearance. The website code already sends these exact form variables:

- `name`
- `email`
- `business`
- `budget`
- `message`

## Template settings

- **Service ID:** `service_ki4cy8e`
- **Template ID:** `template_x6cj49w`
- **To Email:** `cjaydesign063@gmail.com`
- **From Name:** `CJ Design Website`
- **Reply-To:** `{{email}}`
- **Subject:** `New Website Enquiry — CJ Design`

## HTML body

Paste this into the EmailJS template's **Content** field and switch the editor to HTML/source mode if required:

```html
<div style="margin:0;padding:32px 16px;background:#eef3f7;font-family:Arial,Helvetica,sans-serif;color:#122033;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d9e3ea;border-radius:16px;overflow:hidden;">
    <div style="padding:28px 32px;background:#080b14;color:#ffffff;">
      <div style="font-size:12px;letter-spacing:3px;font-weight:bold;color:#31d9ef;">CJ DESIGN</div>
      <div style="margin-top:10px;font-size:26px;line-height:1.15;font-weight:bold;">NEW WEBSITE ENQUIRY</div>
      <div style="margin-top:8px;font-size:12px;color:#aebdca;">A new enquiry was submitted through the CJ Design website.</div>
    </div>

    <div style="padding:28px 32px;">
      <div style="margin-bottom:10px;font-size:11px;letter-spacing:2px;font-weight:bold;color:#009db6;">CLIENT DETAILS</div>
      <div style="border:1px solid #d9e3ea;border-radius:10px;overflow:hidden;">
        <div style="padding:14px 16px;border-bottom:1px solid #e7edf1;">
          <div style="font-size:11px;color:#6c7d8c;">NAME</div>
          <div style="margin-top:5px;font-size:16px;font-weight:bold;color:#122033;">{{name}}</div>
        </div>
        <div style="padding:14px 16px;">
          <div style="font-size:11px;color:#6c7d8c;">EMAIL</div>
          <div style="margin-top:5px;font-size:16px;color:#122033;">{{email}}</div>
        </div>
      </div>

      <div style="margin-top:28px;margin-bottom:10px;font-size:11px;letter-spacing:2px;font-weight:bold;color:#009db6;">WEBSITE REQUIREMENT</div>
      <div style="border:1px solid #d9e3ea;border-radius:10px;overflow:hidden;">
        <div style="padding:14px 16px;border-bottom:1px solid #e7edf1;">
          <div style="font-size:11px;color:#6c7d8c;">WEBSITE TYPE</div>
          <div style="margin-top:5px;font-size:16px;font-weight:bold;color:#122033;">{{business}}</div>
        </div>
        <div style="padding:14px 16px;">
          <div style="font-size:11px;color:#6c7d8c;">COMFORTABLE BUDGET</div>
          <div style="margin-top:5px;font-size:16px;font-weight:bold;color:#122033;">{{budget}}</div>
        </div>
      </div>

      <div style="margin-top:28px;margin-bottom:10px;font-size:11px;letter-spacing:2px;font-weight:bold;color:#009db6;">CLIENT MESSAGE</div>
      <div style="padding:18px 16px;border:1px solid #d9e3ea;border-radius:10px;background:#f8fafb;font-size:15px;line-height:1.65;color:#263849;white-space:pre-line;">{{message}}</div>
    </div>

    <div style="padding:20px 32px;border-top:1px solid #e1e9ee;background:#f8fafb;font-size:12px;line-height:1.6;color:#6c7d8c;">
      <div>This enquiry was submitted through <strong style="color:#122033;">cj-design.vercel.app</strong>.</div>
      <div style="margin-top:4px;">Reply directly to this email to contact <strong style="color:#122033;">{{name}}</strong>.</div>
    </div>
  </div>
</div>
```

## Do not use

Do not include `{{subject}}`, `{{phone}}`, or `{{{message}}}`. The subject is configured in the Subject field above, and the form does not collect phone or subject values. The message uses escaped `{{message}}` because it is user-provided content.
