<?php

class HTTPRequester {

    public static function HTTPPost($accountSid, $authToken, $url, array $params) {
        $query = http_build_query($params);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_USERPWD, $accountSid . ":" . $authToken);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }

}
// -----------------------------------------------------------------------------
$counterName = "countera";
$counterValue = 7;
echo "+ Update counter: " . $counterName . ", to: " . $counterValue;
// -----------------------------------------------------------------------------
$accountSid = getenv("ACCOUNT_SID");
$authToken = getenv('AUTH_TOKEN');
$syncServieSid = getenv('SYNC_SERVICE_SID');
$syncMapName = getenv('SYNC_MAP_NAME');
$jsonData = '{"counter": ' . $counterValue . '}';
$url = "https://sync.twilio.com/v1/Services/{$syncServieSid}/Maps/{$syncMapName}/Items/{$counterName}";
// echo "\xA++ The request URL: ", $url;
$data = array(
    'Data' => $jsonData
);
$http = new HTTPRequester();
$response = $http->HTTPPost($accountSid, $authToken, $url, $data);
// echo "\xA+ Response: {$response}";
$start = stripos($response, "{");
$jsonLength = strlen($response) - $start;
$jsonOnly = substr( $response, $start, $jsonLength );
// echo "\xA+ JSON response:{$jsonOnly}:";
$jsonResponse = json_decode($jsonOnly);
// -----------------------------------------------------------------------------
echo "\xA++ Date created: " . $jsonResponse->date_created;
echo "\xA++ Date updated: " . $jsonResponse->date_updated . "\xA";
?>
