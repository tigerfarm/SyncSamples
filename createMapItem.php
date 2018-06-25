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
$counterName = "countera";  // The Sync Map Key value used as the counter name.
$counterValue = 7;          // One of the Sync Map data values.
echo "+ Create counter: " . $counterName . ", as: " . $counterValue;
$jsonData = '{"counter": ' . $counterValue . '}';
// -----------------------------------------------------------------------------
$accountSid = getenv("ACCOUNT_SID");
$authToken = getenv('AUTH_TOKEN');
$syncServieSid = getenv('SYNC_SERVICE_SID');
$syncMapName = getenv('SYNC_MAP_NAME');
$url = "https://sync.twilio.com/v1/Services/{$syncServieSid}/Maps/{$syncMapName}/Items";
$data = array(
    'Ttl' => 0, // 0 - never expires
    'Key' => "{$counterName}",
    'Data' => $jsonData
);
// echo "\xA++ The request URL: ", $url;
$http = new HTTPRequester();
$response = $http->HTTPPost($accountSid, $authToken, $url, $data);
// substr ( string $string , int $start [, int $length ] )
// stripos($response, "$substring"{")
// strlen()
$start = stripos($response, "{");
$jsonLength = strlen($response) - $start;
// echo "\xA+ JSON start = {$start} JSON length = {$jsonLength}";
$jsonOnly = substr( $response, $start, $jsonLength );
// echo "\xA+ Response :{$response}:";
echo "\xA+ JSON :{$jsonOnly}:";
$jsonResponse = json_decode($jsonOnly);
// -----------------------------------------------------------------------------
echo "\xA++ Created: Key = " . $jsonResponse->key . "\xA";
?>
