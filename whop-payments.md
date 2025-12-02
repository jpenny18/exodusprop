React setup
​
Step 1: Install the package

Copy

Ask AI
npm install @whop/checkout
​
Step 2: Add the checkout element

Copy

Ask AI
import { WhopCheckoutEmbed } from "@whop/checkout/react";

export default function Home() {
  return <WhopCheckoutEmbed planId="plan_XXXXXXXXX" />;
}
This component will now mount an iframe with the Whop checkout embed. Once the checkout is complete, the user will be redirected to the redirect url you specified in the settings on Whop.
You can configure the redirect url in your whop’s settings or in your company’s settings on the dashboard. If both are specified, the redirect url specified in the whop’s settings will take precedence.
Keep that Plan ID handy. You’ll need to paste it into your website code, so save it somewhere you can find it.
​
Step 3: (optional) Configure - Programmatic controls
To get access to the controls of the checkout embed, you can use the ref prop.

Copy

Ask AI
const ref = useCheckoutEmbedControls();

return <WhopCheckoutEmbed ref={ref} planId="plan_XXXXXXXXX" />;
​
submit
To submit checkout programmatically, you can use the submit method on the checkout element.

Copy

Ask AI
ref.current?.submit();
​
getEmail
To get the email of the user who is checking out, you can use the getEmail method on the checkout element.

Copy

Ask AI
const email = await ref.current?.getEmail();
console.log(email);
​
setEmail
To set the email of the user who is checking out, you can use the setEmail method on the checkout element.

Copy

Ask AI
try {
  await ref.current?.setEmail("example@domain.com");
} catch (error) {
  console.error(error);
}
​
getAddress
To get the address of the user who is checking out, you can use the getAddress method on the checkout element.

Copy

Ask AI
const address = await ref.current?.getAddress();
console.log(address);
​
setAddress
To set the address of the user who is checking out, you can use the setAddress method on the checkout element.
This method will only work if the address form is hidden. You can hide the address form by setting the hideAddressForm prop to true.

Copy

Ask AI
try {
  await ref.current?.setAddress({
    name: "John Doe",
    country: "US",
    line1: "123 Main St",
    city: "Any Town",
    state: "CA",
    postalCode: "12345",
  });
} catch (error) {
  console.error(error);
}
​
Step 4: (optional) Configure - Available properties
​
planId
Required - The plan id you want to checkout.
​
theme
Optional - The theme you want to use for the checkout.
Possible values are light, dark or system.
​
sessionId
Optional - The session id to use for the checkout.
This can be used to attach metadata to a checkout by first creating a session through the API and then passing the session id to the checkout element.
​
affiliateCode
Optional - The affiliate code to use for the checkout.

Copy

Ask AI
<WhopCheckoutEmbed affiliateCode="tristan" planId="plan_XXXXXXXXX" />
​
hidePrice
Optional - Turn on to hide the price in the embedded checkout form.
Defaults to false
​
hideTermsAndConditions
Optional - Set to true to hide the terms and conditions in the embedded checkout form.
Defaults to false
​
skipRedirect
Optional - Set to true to skip the final redirect and keep the top frame loaded.
Defaults to false
​
onComplete
Optional - A callback function that will be called when the checkout is complete.
This option will set skipRedirect to true

Copy

Ask AI
<WhopCheckoutEmbed
  onComplete={(planId, receiptId) => {
    console.log(planId, receiptId);
  }}
  planId="plan_XXXXXXXXX"
/>
​
utm
Optional - The UTM parameters to add to the checkout URL.
Note - The keys must start with utm_

Copy

Ask AI
<WhopCheckoutEmbed
  planId="plan_XXXXXXXXX"
  utm={{ utm_campaign: "ad_XXXXXXX" }}
/>
​
fallback
Optional - The fallback content to show while the checkout is loading.

Copy

Ask AI
<WhopCheckoutEmbed fallback={<>loading...</>} planId="plan_XXXXXXXXX" />
​
prefill
Optional - The prefill options to apply to the checkout embed.
Used to prefill the email or address in the embedded checkout form. This setting can be helpful when integrating the embed into a funnel that collects the email prior to payment already.

Copy

Ask AI
<WhopCheckoutEmbed
  prefill={{ email: "example@domain.com" }}
  planId="plan_XXXXXXXXX"
/>
<WhopCheckoutEmbed
  prefill={{ address: {
    name: "John Doe",
    country: "US",
    line1: "123 Main St",
    city: "Any Town",
    state: "CA",
    postalCode: "12345",
  } }}
  planId="plan_XXXXXXXXX"
/>
​
hideEmail
Optional - Set to true to hide the email input in the embedded checkout form. Make sure to display the users email in the parent page when setting this attribute.
Defaults to false
Use this in conjunction with the prefill attribute or the setEmail method to control the email input.

Copy

Ask AI
<WhopCheckoutEmbed hideEmail planId="plan_XXXXXXXXX" />
​
disableEmail
Optional - Set to true to disable the email input in the embedded checkout form.
Defaults to false
Use this in conjunction with the prefill attribute or the setEmail method to control the email input.

Copy

Ask AI
<WhopCheckoutEmbed disableEmail planId="plan_XXXXXXXXX" />
​
hideAddressForm
Optional - Set to true to hide the address form in the embedded checkout form.
Defaults to false
Use this in conjunction with the setAddress method to control the address input.

Copy

Ask AI
<WhopCheckoutEmbed hideAddressForm planId="plan_XXXXXXXXX" />
​
setupFutureUsage
Optional - The setup future usage to use for the checkout. When using the chargeUser API you need to set this to off_session. This will filter out payment methods that are not supported with that API.

Copy

Ask AI
<WhopCheckoutEmbed setupFutureUsage="off_session" planId="plan_XXXXXXXXX" />
​
onAddressValidationError
Optional - A callback function that will be called when the address validation error occurs.
This method will only work if the address form is hidden. You can hide the address form by setting the hideAddressForm prop to true.

Copy

Ask AI
<WhopCheckoutEmbed
  hideAddressForm
  onAddressValidationError={(error) => {
    console.log(error);
  }}
  planId="plan_XXXXXXXXX"
/>
​
Full example

Copy

Ask AI
import { WhopCheckoutEmbed } from "@whop/checkout/react";

export default function Home() {
  return (
    <WhopCheckoutEmbed
      fallback={<>loading...</>}
      planId="plan_XXXXXXXXX"
      theme="light"
      hidePrice={false}
      sessionId="ch_XXXXXXXXX"
    />
  );
}
​
Other websites
​
Step 1: Add the script tag
To embed checkout, you need to add the following script tag into the <head> of your page:

Copy

Ask AI
<script
  async
  defer
  src="https://js.whop.com/static/checkout/loader.js"
></script>
​
Step 2: Add the checkout element
To create a checkout element, you need to include the following attribute on an element in your page:

Copy

Ask AI
<div data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
This will now mount an iframe inside of the element with the plan id you provided. Once the checkout is complete, the user will be redirected to the redirect url you specified in the settings on Whop.
You can configure the redirect url in your whop’s settings or in your company’s settings on the dashboard. If both are specified, the redirect url specified in the whop’s settings will take precedence.
​
Step 3: (optional) Configure - Programmatic controls
First, attach an id to the checkout container:

Copy

Ask AI
<div id="whop-embedded-checkout" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
submit
To submit checkout programmatically, you can use the submit method on the checkout element.

Copy

Ask AI
wco.submit("whop-embedded-checkout");
​
getEmail
To get the email of the user who is checking out, you can use the getEmail method on the checkout element.

Copy

Ask AI
const email = await wco.getEmail("whop-embedded-checkout");
console.log(email);
​
setEmail
To set the email of the user who is checking out, you can use the setEmail method on the checkout element.

Copy

Ask AI
wco.setEmail("whop-embedded-checkout", "example@domain.com");
​
getAddress
To get the address of the user who is checking out, you can use the getAddress method on the checkout element.

Copy

Ask AI
const address = await wco.getAddress("whop-embedded-checkout");
console.log(address);
​
setAddress
To set the address of the user who is checking out, you can use the setAddress method on the checkout element.
This method will only work if the address form is hidden. You can hide the address form by setting the data-whop-checkout-hide-address prop to true.

Copy

Ask AI
try {
  await wco.setAddress("whop-embedded-checkout", {
    name: "John Doe",
    country: "US",
    line1: "123 Main St",
    city: "Any Town",
    state: "CA",
    postalCode: "12345",
  });
} catch (error) {
  console.error(error);
}
​
Step 4: (optional) Configure - Available attributes
​
data-whop-checkout-plan-id
Required - The plan id you want to checkout.
To get your plan id, you need to first create a plan in the Manage Pricing section on your whop page.
​
data-whop-checkout-theme
Optional - The theme you want to use for the checkout.
Possible values are light, dark or system.

Copy

Ask AI
<div data-whop-checkout-theme="light" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-theme-accent-color
Optional - The accent color to apply to the checkout embed
Possible values are
tomato
red
ruby
crimson
pink
plum
purple
violet
iris
cyan
teal
jade
green
grass
brown
blue
orange
indigo
sky
mint
yellow
amber
lime
lemon
magenta
gold
bronze
gray

Copy

Ask AI
<div data-whop-checkout-theme-accent-color="green" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-session
Optional - The session id to use for the checkout.
This can be used to attach metadata to a checkout by first creating a session through the API and then passing the session id to the checkout element.

Copy

Ask AI
<div data-whop-checkout-session="ch_XXXXXXXXX" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-affiliate-code
Optional - The affiliate code to use for the checkout.

Copy

Ask AI
<div data-whop-checkout-affiliate-code="tristan" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-hide-price
Optional - Set to true to hide the price in the embedded checkout form.
Defaults to false

Copy

Ask AI
<div data-whop-checkout-hide-price="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-hide-submit-button
Optional - Set to true to hide the submit button in the embedded checkout form.
Defaults to false
When using this Option, you will need to programmatically submit the checkout form.

Copy

Ask AI
<div data-whop-checkout-hide-submit-button="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-hide-tos
Optional - Set to true to hide the terms and conditions in the embedded checkout form.
Defaults to false

Copy

Ask AI
<div data-whop-checkout-hide-tos="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-skip-redirect
Optional - Set to true to skip the final redirect and keep the top frame loaded.
Defaults to false

Copy

Ask AI
<div data-whop-checkout-skip-redirect="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-on-complete
Optional - The callback to call when the checkout succeeds
This option will set data-whop-checkout-skip-redirect to true

Copy

Ask AI
<script>
  window.onCheckoutComplete = (planId, receiptId) => {
    console.log(planId, receiptId);
  };
</script>

<div
  data-whop-checkout-on-complete="onCheckoutComplete"
  data-whop-checkout-plan-id="plan_XXXXXXXXX"
></div>
​
data-whop-checkout-on-state-change
Optional - The callback to call when state of the checkout changes
This can be used when programmatically controlling the submit of the checkout embed.

Copy

Ask AI
<script>
  window.onCheckoutStateChange = (state) => {
    console.log(state);
  };
</script>

<div
  data-whop-checkout-on-state-change="onCheckoutStateChange"
  data-whop-checkout-plan-id="plan_XXXXXXXXX"
></div>
​
data-whop-checkout-skip-utm
By default any utm params from the main page will be forwarded to the checkout embed.
Optional - Set to true to prevent the automatic forwarding of utm parameters
Defaults to false
​
data-whop-checkout-prefill-*
Used to prefill the email or address in the embedded checkout form. This setting can be helpful when integrating the embed into a funnel that collects the email prior to payment already.

Copy

Ask AI
<div data-whop-checkout-prefill-email="example@domain.com" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>

<div 
	data-whop-checkout-prefill-name="John Doe"
	data-whop-checkout-prefill-address-country="US"
	data-whop-checkout-prefill-address-line1="123 Main St"
	data-whop-checkout-prefill-address-line2=""
	data-whop-checkout-prefill-address-city="Any Town"
	data-whop-checkout-prefill-address-state="CA"
	data-whop-checkout-prefill-address-postal-code="12345"
	data-whop-checkout-plan-id="plan_XXXXXXXXX"
></div>

<div data-whop-checkout-prefill-address-name="John Doe" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-hide-email
Optional - Set to true to hide the email input in the embedded checkout form. Make sure to display the users email in the parent page when setting this attribute.
Defaults to false
Use this in conjunction with the data-whop-checkout-prefill-email attribute or the setEmail method to control the email input.

Copy

Ask AI
<div data-whop-checkout-hide-email="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-disable-email
Optional - Set to true to disable the email input in the embedded checkout form.
Defaults to false
Use this in conjunction with the data-whop-checkout-prefill-email attribute or the setEmail method to control the email input.

Copy

Ask AI
<div data-whop-checkout-disable-email="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-hide-address
Optional - Set to true to hide the address form in the embedded checkout form.
Defaults to false
This method will only work if the address form is hidden. You can hide the address form by setting the data-whop-checkout-hide-address prop to true.

Copy

Ask AI
<div data-whop-checkout-hide-address="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-setup-future-usage
Optional - The setup future usage to use for the checkout. When using the chargeUser API you need to set this to off_session. This will filter out payment methods that are not supported with that API.

Copy

Ask AI
<div data-whop-checkout-setup-future-usage="off_session" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-on-address-validation-error
Optional - The callback to call when the address validation error occurs.
This method will only work if the address form is hidden. You can hide the address form by setting the data-whop-checkout-hide-address prop to true.

Copy

Ask AI
<script>
  window.onAddressValidationError = (error) => {
    console.log(error);
  };
</script>

<div
  data-whop-checkout-on-address-validation-error="onAddressValidationError"
  data-whop-checkout-plan-id="plan_XXXXXXXXX"
></div>
​
Full example

Copy

Ask AI
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<script
			async
			defer
  			src="https://js.whop.com/static/checkout/loader.js"
		></script>
		<title>Whop embedded checkout example</title>
		<style>
			div {
				box-sizing: border-box;
			}
			body {
				margin: 0
			}
		</style>
	</head>
	<body>
		<div
			data-whop-checkout-plan-id="plan_XXXXXXXXX"
			data-whop-checkout-session="ch_XXXXXXXXX"
			data-whop-checkout-theme="light"
			data-whop-checkout-hide-price="false"
			style="height: fit-content; overflow: hidden; max-width: 50%;"
		></div>
	</body>
</html>
​
Apple Pay
Apple Pay is a payment method that allows users to pay with their Apple Wallet. To enable Apple Pay, you need to register your domain first. To do so go to your whop’s settings and click Configure in the Payment domains section. Click the plus button to add a new domain.
Verifying your domain will require you to host this file on https://<your-domain>/.well-known/apple-developer-merchantid-domain-association. Please refer to your framework’s or hosting provider’s documentation on how to host this file.
When using the hideSubmitButton option in react, @whop/checkout@0.0.43 or later is required for Apple Pay to show up in the embed.
​
