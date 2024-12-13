**Specifications Document: Mobile Application for Home Automation with Bluetooth Control**

---

### **1. Context and Objectives**

#### **User Story**
As a user (while cycling or pushing a stroller), I want to open my home’s gate and garage door without taking my phone out of my pocket.

To achieve this:
- I use a Bluetooth device (a button) that, when pressed, sends a command to the mobile application to execute the corresponding action (e.g., open the gate).
- My house is equipped with home automation that exposes a web API capable of performing these operations.

The goal of the application is to provide a simple and secure way to control home automation equipment via Bluetooth and API.

---

### **2. Application Features**

#### **2.1. Settings**

1. **Action Configuration**:
   - Enable the creation of actions associated with home automation operations.
   - An action is configured via:
     - **URL**: The API endpoint for executing the action (e.g., open the gate).
     - **HTTP Method**: GET, POST, etc.
     - **Headers**: Information such as authentication tokens.
     - **Payload**: Any data to be sent with the request.
     - **Authentication**: Integration of security mechanisms such as OAuth or API keys.

2. **Bluetooth Configuration**:
   - Scan and display available Bluetooth devices.
   - Allow connection of a Bluetooth device to the application.
   - Manage connected devices (e.g., attach, revoke, rename).

#### **2.2. Home**

1. **Action Dashboard**:
   - Display a panel consisting of **tiles** representing each configured action.
   - Each tile should:
     - Allow execution of the associated action with a single click.
     - Display visual feedback (success/error) after execution.

2. **Bluetooth Status**:
   - Show currently connected Bluetooth devices.

#### **2.3. General Features**

1. **Security**:
   - Consider the criticality of home automation actions (gate/garage door).
   - Integration of strong authentication (e.g., password or biometric authentication for accessing settings).
   - Encryption of Bluetooth and API communications.

2. **Logs**:
   - Log each action execution with:
     - Date/time of execution.
     - Bluetooth device that initiated the request.
     - Action result (success/error).

3. **Automatic Execution via Bluetooth**:
   - Allow triggering of configured actions from the Bluetooth button without manual interaction with the application.

4. **Geolocation Option**:
   - Add a proximity constraint (to be enabled/disabled in settings).
   - Example: Allow execution of actions only if the phone is within 300 meters of the home.

---

### **3. Technical Specifications**

#### **3.1. Bluetooth**
- Use **Bluetooth Low Energy (BLE)** to ensure low energy consumption.
- Manage permissions for Bluetooth access on Android.

#### **3.2. API**
- Compatible with REST methods (GET, POST, PUT, DELETE).
- Support for authentication via OAuth2 or API keys.
- Handle potential HTTP errors (connection failures, 4XX/5XX codes).

#### **3.3. Location Services**
- Use Android location services.
- Real-time verification of the distance between the user and the preconfigured address.

#### **3.4. User Interface**
- Intuitive design with a focus on accessibility (buttons and tiles easily visible and operable).
- Immediate user feedback (color changes, status messages).
- Optional support for dark mode.

---

### **4. Deliverables**

1. **Android Application**:
   - Compatible with Android 10 and higher.
   - Installable APK with installation documentation.

2. **Documentation**:
   - User guide (action configuration, Bluetooth connection, logs).
   - Technical details (architecture, API endpoints used, security).
   - **Bluetooth Interface Contract**: Provide concrete examples of Bluetooth payloads to trigger actions (e.g., structure of sent/received messages).

---

### **5. Key Points of Attention**

1. **Security**: Ensure optimal protection of sensitive data.
2. **Bluetooth Reliability**: Manage connection or signal loss issues.
3. **User Experience**: Ensure a smooth and responsive interface.
4. **Scalability**: Plan for the possibility of adding new actions or integrations (e.g., surveillance cameras, sensors).

