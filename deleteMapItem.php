<?php

class HTTPRequester {

    public static function HTTPDelete($accountSid, $authToken, $url, $data) {
        $query = http_build_query($data);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_USERPWD, $accountSid . ":" . $authToken);
        curl_setopt($ch, CURLOPT_URL, $url);
        // curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }

}
// -----------------------------------------------------------------------------
$counterName = "counterd";  // The Sync Map Key value used as the counter name.
echo "+ Delete counter: " . $counterName;
// -----------------------------------------------------------------------------
$accountSid = getenv("ACCOUNT_SID");
$authToken = getenv('AUTH_TOKEN');
$syncServieSid = getenv('SYNC_SERVICE_SID');
$syncMapName = getenv('SYNC_MAP_NAME');
$url = "https://sync.twilio.com/v1/Services/{$syncServieSid}/Maps/{$syncMapName}/Items/{$counterName}";
// echo "\xA++ The request URL: ", $url;
$data = array(
    'Key' => "{$counterName}"
);
$http = new HTTPRequester();
$response = $http->HTTPDelete($accountSid, $authToken, $url, $data);
echo "\xA+ Response :{$response}:";
$start = stripos($response, "{");
$jsonLength = strlen($response) - $start;
$jsonOnly = substr( $response, $start, $jsonLength );
// echo "\xA+ JSON :{$jsonOnly}:";
$jsonResponse = json_decode($jsonOnly);
// -----------------------------------------------------------------------------
echo "\xA++ Created: Key = " . $jsonResponse->key . "\xA";
?>
