# Contact Form Setup Guide - SUPER SIMPLE! 🚀

Your contact form will send emails directly to **jayaprakashkumar367@gmail.com**

## ⚡ One-Time Setup (2 minutes)

### Step 1: Create Formspree Account

1. Go to [https://formspree.io/](https://formspree.io/)
2. Click "Get Started" (it's FREE!)
3. Sign up with your email

### Step 2: Create Your Form

1. After logging in, click "New Form"
2. Name it: "Portfolio Contact Form"
3. Set the email to: **jayaprakashkumar367@gmail.com**
4. Click "Create Form"

### Step 3: Get Your Form Endpoint

1. After creating the form, you'll see a code like: `https://formspree.io/f/xyzabcde`
2. Copy the part after `/f/` (example: `xyzabcde`)

### Step 4: Update Your Website

1. Open `index.html`
2. Find line ~171 that says:
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/xyzabcde" method="POST">
   ```
3. Replace `xyzabcde` with your actual form ID
4. Save the file

## ✅ That's It!

Now when someone fills out your contact form:
1. They click "Send Message"
2. Email is sent directly to **jayaprakashkumar367@gmail.com**
3. No email app opens - it just works! ✨

## 🎯 Free Plan Features

Formspree free plan gives you:
- ✅ 50 submissions per month
- ✅ Spam filtering
- ✅ Email notifications
- ✅ No credit card required

Perfect for a portfolio!

## � What You'll Receive

When someone contacts you, you'll get an email with:
- Their name
- Their email address
- Subject line
- Their message

You can reply directly from your Gmail!

---

**That's all! Simple and works instantly!** 🎉
